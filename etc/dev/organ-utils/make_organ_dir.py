#!/usr/bin/env python3

import argparse
from pathlib import Path
import sys
from datetime import datetime
from dataclasses import dataclass
import csv
from itertools import groupby
import re
from typing import DefaultDict

from jsonschema import validate
import requests
from yaml import dump, safe_load
import json


def main():
    repo_path = Path(__file__).resolve().parent.parent.parent.parent
    parser = argparse.ArgumentParser(formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser.add_argument(
        '--target',
        type=dir_path,
        default=repo_path / 'context/app/organ',
        help='Target directory for markdown files')
    parser.add_argument(
        '--elasticsearch_url',
        default='https://search.api.hubmapconsortium.org/v3/portal/search',
        help='ES endpoint to query for organs')
    parser.add_argument(
        '--azimuth_url',
        default='https://raw.githubusercontent.com/satijalab/azimuth_website/master/data/azimuth_references.yaml',
        help='Azimuth references')
    parser.add_argument(
        '--ccf_url',
        default='https://grlc.io/api-git/hubmapconsortium/ccf-grlc/subdir/ccf/ref-organ-terms',
        help='CCF references')
    args = parser.parse_args()

    global cache_path
    cache_path = Path(__file__).parent / f'cache-{datetime.now().isoformat()}'
    cache_path.mkdir()

    descriptions = get_descriptions()
    uberon_names = {uberon: value['name'] for uberon, value in descriptions.items()}

    search_organs_by_uberon = rekey_search(
        get_search_organs(get_search_response(args.elasticsearch_url)),
        uberon_names=uberon_names)
    azimuth_organs_by_uberon = rekey_azimuth(
        add_vitessce(get_azimuth_yaml(args.azimuth_url)))
    ccf_organs_by_uberon = rekey_ccf(
        requests.get(args.ccf_url, headers={"accept": "application/json"}).json())
    onto_by_uberon = get_ontology_info(descriptions.keys())

    def small_dict(big_dict, k):
        return {uberon_id: value[k] for uberon_id, value in big_dict.items() if k in value}

    merged_data = merge_data(
        uberon={uberon_id: uberon_id for uberon_id in descriptions.keys()},
        uberon_short={uberon_id: uberon_id.split('/')[-1] for uberon_id in descriptions.keys()},
        name=small_dict(descriptions, 'name'),
        asctb=small_dict(descriptions, 'asctb'),
        description={uberon_id: onto_info['annotation']['definition'][0]
                     for (uberon_id, onto_info) in onto_by_uberon.items()},
        icon=small_dict(descriptions, 'icon'),
        has_iu_component={uberon_id: True for uberon_id in ccf_organs_by_uberon.keys()},
        search=search_organs_by_uberon,
        azimuth=azimuth_organs_by_uberon
    )

    unmatched = {u.split("/")[-1] for u in merged_data.keys() - descriptions.keys()}
    expected_unmatched = {
        # This list should be empty when https://github.com/hubmapconsortium/portal-ui/issues/2945
        # and https://github.com/hubmapconsortium/portal-ui/issues/2943 are resolved.

        # Why FMA? Resolve paired organs:
        'fma7214', 'fma7213',
        'fma24977', 'fma24978',
        'fma57991', 'fma57987',
        'fma323951',

        # Just resolve paired organs:
        'UBERON_0004549', 'UBERON_0004548',
        'UBERON_0001222', 'UBERON_0001223',
        'UBERON_0004539', 'UBERON_0004538',
        'UBERON_0001303', 'UBERON_0001302',

        # Other data soures are higher or lower level:
        'UBERON_0002509', 'UBERON_0000079', 'UBERON_0001004', 'UBERON_0001465'
    }
    unexpected_unmatched = unmatched - expected_unmatched
    if unexpected_unmatched:
        as_string = ", ".join(sorted(unexpected_unmatched))
        raise Exception(f'Unexpected unmatched IDs: {as_string}')

    organs = [
        Organ(
            name=data.get('name'),
            data=data)
        for data in merged_data.values() if 'name' in data
    ]

    DirectoryWriter(args.target, organs).write()
    organ_schema = safe_load((Path(__file__).parent / 'organ-schema.yaml').read_text())
    for p in (repo_path / 'context/app/organ').glob('*.yaml'):
        organ = safe_load(p.read_text())
        validate(instance=organ, schema=organ_schema)


def merge_data(**kwargs):
    '''
    >>> merged = merge_data(
    ...     capital={
    ...         'USA': 'Washington',
    ...         'UK': 'London'},
    ...     population={
    ...         'USA': 3e8,
    ...         'China': 1e9})
    >>> from pprint import pp
    >>> pp(merged)
    {'USA': {'capital': 'Washington', 'population': 300000000.0},
     'UK': {'capital': 'London'},
     'China': {'population': 1000000000.0}}
    '''
    merged = DefaultDict(dict)
    for source, data in kwargs.items():
        for key, value in data.items():
            merged[key][source] = value
    return dict(merged)

###### Ontology ######


def get_ontology_info(ids):
    ontology_info = {}
    url_base = 'https://www.ebi.ac.uk/ols/api/ontologies/uberon/terms/'
    for id in ids:
        # Plain ASCII encoding ("%2F") doesn't work with this service.
        url = f"{url_base}{id.replace('/', '%252F')}"
        response = requests.get(url)
        response.raise_for_status()
        ontology_info[id] = response.json()
    return ontology_info


###### Descriptions ######

def get_descriptions():
    descriptions_path = Path(__file__).parent / 'descriptions.yaml'
    return safe_load(descriptions_path.read_text())


###### Azimuth #######

def get_azimuth_yaml(url):
    response = requests.get(url)
    response.raise_for_status()
    all_azimuth = safe_load(response.text)
    human_azimuth = [v for v in all_azimuth if v['species'] == 'Human']
    return human_azimuth


def add_vitessce(azimuth_organs):
    '''
    Given the azimuth references, fetch and integrate the vitessce config for each.
    '''
    for organ in azimuth_organs:
        url = organ.get('vitessce_conf_url')
        if not url:
            continue
        response = requests.get(url)
        response.raise_for_status()
        organ['vitessce_conf'] = response.json()
    return azimuth_organs


def rekey_azimuth(azimuth_organs):
    return {organ['uberon_iri']: organ for organ in azimuth_organs if 'uberon_iri' in organ}


###### Search #######

agg_name = 'organs'


def get_search_response(es_url):
    return requests.post(
        es_url,
        json={
            "size": 0,
            "aggs": {
                agg_name: {
                    "terms": {
                        "field": "origin_samples.mapped_organ.keyword",
                        "size": 100
                    }
                }
            }
        }).json()


def get_search_organs(response):
    return [b['key'] for b in response['aggregations'][agg_name]['buckets']]


def rekey_search(search_organs, uberon_names):
    '''
    >>> search_organs = ['Kidney (Left)', 'Kidney (Right)', 'Spleen', 'Lung (Right)']
    >>> uberon_names = {'UBERON_0002113': 'Kidney',
    ...                 'UBERON_0002106': 'Spleen',
    ...                 'UBERON_0002048': 'Lungs'}
    >>> from pprint import pp
    >>> pp(rekey_search(search_organs, uberon_names))
    {'UBERON_0002113': ['Kidney (Left)', 'Kidney (Right)'],
     'UBERON_0002106': ['Spleen'],
     'UBERON_0002048': ['Lung (Right)']}
    '''
    return {
        uberon_id: [
            name for name in search_organs
            if uberon_name in name
            or uberon_name.rstrip('s') in name]
        for uberon_id, uberon_name in uberon_names.items()
    }

###### CCF ######


def rekey_ccf(api_response):
    return {organ['representation_of']: organ for organ in api_response}

###### Utils #######


@dataclass
class Organ:
    '''
    >>> organ = Organ(name='Small Intestine', data={'foo': 'bar'})
    >>> print(organ.yaml())
    name: Small Intestine
    foo: bar
    >>> print(organ.filename())
    small-intestine.yaml
    '''
    name: str
    data: dict

    def yaml(self):
        return dump(
            {'name': self.name, **self.data},
            sort_keys=False
        ).strip()

    def filename(self):
        return re.sub(r'\W+', ' ', self.name.lower()).strip().replace(' ', '-') + '.yaml'


def dir_path(s):
    path = Path(s)
    if path.is_dir():
        return path
    else:
        raise ValueError(f'"{s}" is not a directory')


class DirectoryWriter():
    def __init__(self, dir, organs):
        self.dir = dir
        self.organs = organs

    def write(self):
        for f in self.dir.glob('*'):
            f.unlink()
        note = f'Do not hand edit! Generated by {
            Path(__file__).name} on {
            datetime.now().isoformat()}.'
        for organ in self.organs:
            self.write_organ(organ, note)

    def write_organ(self, organ, note):
        file = self.dir / organ.filename()
        print(f'Writing to {file}...')
        file.write_text(f'# {note}\n\n' + organ.yaml())


if __name__ == "__main__":
    sys.exit(main())  # pragma: no cover
