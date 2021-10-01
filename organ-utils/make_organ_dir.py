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
    repo_path = Path(__file__).resolve().parent.parent
    parser = argparse.ArgumentParser(formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser.add_argument(
        '--target',
        type=dir_path,
        default=repo_path / 'context/app/organ',
        help='Target directory for markdown files')
    parser.add_argument(
        '--elasticsearch_url',
        default='https://search.api.hubmapconsortium.org/portal/search',
        help='ES endpoint to query for organs')
    parser.add_argument(
        '--azimuth_url',
        default='https://raw.githubusercontent.com/satijalab/azimuth_website/master/data/azimuth_references.yaml',
        help='Azimuth references')
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
        add_vitessce(get_azimuth_yaml(args.azimuth_url)),
        uberon_names=uberon_names)

    merged_data = merge_data(
        uberon=
            {uberon_id: uberon_id for uberon_id in descriptions.keys()},
        uberon_short=
            {uberon_id: uberon_id.split('/')[-1] for uberon_id in descriptions.keys()},
        name=
            {uberon_id: value['name'] for uberon_id, value in descriptions.items()},
        description=
            {uberon_id: value['description'] for uberon_id, value in descriptions.items()},
        has_iu_component=
            {uberon_id: value.get('has_iu_component', True) for uberon_id, value in descriptions.items()},
        search=
            search_organs_by_uberon,
        azimuth=
            azimuth_organs_by_uberon
    )

    organs = [
        Organ(
            name=data['name'],
            data=data)
        for data in merged_data.values()
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


###### Descriptions ######

def get_descriptions():
    descriptions_path = Path(__file__).parent / 'descriptions.yaml'
    return safe_load(descriptions_path.read_text())


###### Azimuth #######

def get_azimuth_yaml(url):
    azimuth_path = cache_path / 'azimuth.yaml'
    response = requests.get(url)
    response.raise_for_status()
    azimuth_path.write_text(response.text)
    all_azimuth = safe_load(azimuth_path.read_text())
    human_azimuth = [v for v in all_azimuth if v['species'] == 'Human']
    return human_azimuth

def add_vitessce(azimuth_organs):
    '''
    Given an azimuth reference, use heuritics to fetch and integrate the vitessce config.
    TODO: Get NYGC to make the mapping explicit.
    '''
    for organ in azimuth_organs:
        file = organ['vitessce'].split('/')[-1] + '.json'
        if file == 'human_motorcortex.json':
            # No such file, and even if it existed, not clear
            # if it should just be applied to the "brain" organ.
            continue
        base = 'https://raw.githubusercontent.com/satijalab/azimuth_website/master'
        url = f'{base}/assets/json/{file}'
        vitessce_path = cache_path / file
        response = requests.get(url)
        response.raise_for_status()
        vitessce_path.write_text(response.text)
        vitessce_conf = json.loads(vitessce_path.read_text())
        organ['vitessce_conf'] = vitessce_conf
    return azimuth_organs

def rekey_azimuth(azimuth_organs, uberon_names):
    # TODO: Get NYGC to add Uberon IDs / Get rid of heuristics.
    '''
    >>> uberon_names = {
    ...     'UBERON_0002113': 'Kidney',
    ...     'UBERON_0002048': 'Lungs'}
    >>> azimuth_organs = [
    ...     {'title': 'Human - Kidney'},
    ...     {'title': 'Human - Lung'}]
    >>> rekey_azimuth(azimuth_organs, uberon_names)
    {'UBERON_0002113': {'title': 'Human - Kidney'}, 'UBERON_0002048': {'title': 'Human - Lung'}}

    >>> azimuth_organs = [
    ...     {'title': 'Human - Kidney'},
    ...     {'title': 'Human - duplicate - Kidney'}]
    >>> rekey_azimuth(azimuth_organs, uberon_names)
    Traceback (most recent call last):
    ...
    AssertionError: Multiple matches for uberon in azimuth: {'UBERON_0002113': 2}
    '''
    azimuth_organs = {
        uberon_id: [
            organ for organ in azimuth_organs
            if uberon_name in organ['title']
            or uberon_name.rstrip('s') in organ['title']]
        for uberon_id, uberon_name in uberon_names.items()
    }
    multi_matches = {k: len(v) for k, v in azimuth_organs.items() if len(v) > 1}
    assert not multi_matches, \
        f'Multiple matches for uberon in azimuth: {multi_matches}'
    return {k: v[0] for k, v in azimuth_organs.items() if v}


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
                        "field": "origin_sample.mapped_organ.keyword",
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
        readme_text = f'Generated by {Path(__file__).name} on {datetime.now()}.'
        (self.dir / 'README.md').write_text(readme_text)
        for organ in self.organs:
            self.write_organ(organ)
    def write_organ(self, organ):
        file = self.dir / organ.filename()
        print(f'Writing to {file}...')
        file.write_text(organ.yaml())
        

if __name__ == "__main__":
    sys.exit(main())  # pragma: no cover
