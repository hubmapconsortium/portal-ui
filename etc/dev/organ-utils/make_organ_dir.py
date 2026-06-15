#!/usr/bin/env python3

import argparse
from pathlib import Path
import sys
from datetime import datetime
from dataclasses import dataclass
import re
import urllib.parse
from typing import DefaultDict

from jsonschema import validate
import requests
from yaml import dump, safe_load


OBO_BASE = 'http://purl.obolibrary.org/obo/'


def main():
    repo_path = Path(__file__).resolve().parent.parent.parent.parent
    parser = argparse.ArgumentParser(formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser.add_argument(
        '--target',
        type=dir_path,
        default=repo_path / 'context/app/organ',
        help='Target directory for markdown files',
    )
    parser.add_argument(
        '--elasticsearch_url',
        default='https://search.api.hubmapconsortium.org/v3/portal/search',
        help='ES endpoint to query for organs',
    )
    parser.add_argument(
        '--organs_url',
        default='https://ontology.api.hubmapconsortium.org/organs?application_context=hubmap',
        help='HuBMAP ontology organs endpoint (canonical organ list + lateralities)',
    )
    parser.add_argument(
        '--ccf_url',
        default='https://grlc.io/api-git/hubmapconsortium/ccf-grlc/subdir/ccf/ref-organ-terms',
        help='CCF references',
    )
    args = parser.parse_args()

    global cache_path
    cache_path = Path(__file__).parent / f'cache-{datetime.now().isoformat()}'
    cache_path.mkdir()

    descriptions = get_descriptions()

    # The ontology endpoint links lateralized organs (e.g. "Kidney (Left)") to their parent
    # organ via the `category` field, replacing the old fuzzy name matching.
    organs_endpoint = get_organs_endpoint(args.organs_url)
    term_to_parent_iri = build_term_to_parent_iri(organs_endpoint)
    child_to_parent_iri = build_child_to_parent_iri(organs_endpoint)

    search_organs_by_uberon = rekey_search(
        get_search_organs(get_search_response(args.elasticsearch_url)),
        term_to_parent_iri=term_to_parent_iri,
        all_uberon_iris=descriptions.keys(),
    )
    ccf_organs_by_uberon = rekey_ccf(
        get_ccf_rows(args.ccf_url),
        child_to_parent_iri=child_to_parent_iri,
    )
    onto_by_uberon = get_ontology_info(descriptions.keys())

    def small_dict(big_dict, k):
        return {uberon_id: value[k] for uberon_id, value in big_dict.items() if k in value}

    merged_data = merge_data(
        uberon={uberon_id: uberon_id for uberon_id in descriptions.keys()},
        uberon_short={uberon_id: uberon_id.split('/')[-1] for uberon_id in descriptions.keys()},
        name=small_dict(descriptions, 'name'),
        asctb=small_dict(descriptions, 'asctb'),
        description={
            uberon_id: definition
            for (uberon_id, onto_info) in onto_by_uberon.items()
            if (definition := get_definition(onto_info))
        },
        icon=small_dict(descriptions, 'icon'),
        has_iu_component={uberon_id: True for uberon_id in ccf_organs_by_uberon.keys()},
        search=search_organs_by_uberon,
    )

    # CCF tracks many anatomical structures the portal does not surface as organ pages
    # (whole systems, higher/lower-level structures, organs we have no descriptions entry for).
    # These resolve to a uberon id that is not in descriptions.yaml; warn rather than fail so the
    # script stays runnable as CCF grows. To add a page, add an entry to descriptions.yaml.
    unmatched_organs = sorted(merged_data.keys() - descriptions.keys())
    if unmatched_organs:
        as_string = '\n  '.join(unmatched_organs)
        print(
            f'Warning: {len(unmatched_organs)} organ(s) from other sources have no '
            f'descriptions.yaml entry and will not get an organ page:\n  {as_string}'
        )

    organs = [
        Organ(name=data.get('name'), data=data) for data in merged_data.values() if 'name' in data
    ]

    DirectoryWriter(args.target, organs).write()
    organ_schema = safe_load((Path(__file__).parent / 'organ-schema.yaml').read_text())
    for p in args.target.glob('*.yaml'):
        organ = safe_load(p.read_text())
        validate(instance=organ, schema=organ_schema)


def merge_data(**kwargs):
    """
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
    """
    merged = DefaultDict(dict)
    for source, data in kwargs.items():
        for key, value in data.items():
            merged[key][source] = value
    return dict(merged)


###### Ontology organs endpoint ######


def get_organs_endpoint(url):
    response = requests.get(url)
    response.raise_for_status()
    return response.json()


def normalize_id(identifier):
    """
    Reduce a UBERON/FMA CURIE or IRI to a canonical PREFIX_DIGITS form so identifiers
    from different sources (ontology endpoint, CCF) compare equal.

    >>> normalize_id('UBERON:0002113')
    'UBERON_0002113'
    >>> normalize_id('http://purl.obolibrary.org/obo/UBERON_0002113')
    'UBERON_0002113'
    >>> normalize_id('http://purl.org/sig/ont/fma/fma24978')
    'FMA_24978'
    >>> normalize_id('FMA:24978')
    'FMA_24978'
    """
    tail = identifier.rsplit('/', 1)[-1].rsplit('#', 1)[-1].replace(':', '_')
    match = re.match(r'([A-Za-z]+)_?(\d+)', tail)
    return f'{match.group(1).upper()}_{match.group(2)}' if match else tail


def obo_iri(identifier):
    """Normalize any organ identifier to its OBO IRI form (matches descriptions.yaml keys)."""
    return OBO_BASE + normalize_id(identifier)


def parent_of(entry):
    """
    The parent organ's uberon CURIE: a lateralized organ (e.g. "Kidney (Left)") carries a
    `category` pointing at its parent ("Kidney"); an unpaired organ is its own parent.
    """
    category = entry.get('category')
    return category['organ_uberon'] if category else entry['organ_uberon']


def build_term_to_parent_iri(organs_endpoint):
    """Map each organ search term (matching ES `mapped_organ`) to its parent organ's OBO IRI."""
    return {entry['term']: obo_iri(parent_of(entry)) for entry in organs_endpoint}


def build_child_to_parent_iri(organs_endpoint):
    """Map each organ's own OBO IRI to its parent organ's OBO IRI (lateralized -> parent)."""
    return {obo_iri(entry['organ_uberon']): obo_iri(parent_of(entry)) for entry in organs_endpoint}


###### Descriptions ######


def get_descriptions():
    descriptions_path = Path(__file__).parent / 'descriptions.yaml'
    return safe_load(descriptions_path.read_text())


###### Search #######

agg_name = 'organs'


def get_search_response(es_url):
    return requests.post(
        es_url,
        json={
            'size': 0,
            'aggs': {
                agg_name: {
                    'terms': {
                        'field': 'origin_samples.mapped_organ.keyword',
                        'size': 100,
                    }
                }
            },
        },
    ).json()


def get_search_organs(response):
    return [b['key'] for b in response['aggregations'][agg_name]['buckets']]


def rekey_search(search_organs, term_to_parent_iri, all_uberon_iris):
    """
    Group the organ names from Elasticsearch under their parent organ's uberon IRI, using the
    ontology endpoint to resolve lateralized names (e.g. "Kidney (Left)") to their parent organ.
    Every organ gets a (possibly empty) list.

    >>> search_organs = ['Kidney (Left)', 'Kidney (Right)', 'Spleen', 'Tonsil (Left)']
    >>> term_to_parent_iri = {
    ...     'Kidney (Left)': 'iri/Kidney',
    ...     'Kidney (Right)': 'iri/Kidney',
    ...     'Spleen': 'iri/Spleen',
    ...     'Tonsil (Left)': 'iri/Tonsil'}
    >>> from pprint import pp
    >>> pp(rekey_search(search_organs, term_to_parent_iri, ['iri/Kidney', 'iri/Spleen', 'iri/Lung']))
    {'iri/Kidney': ['Kidney (Left)', 'Kidney (Right)'],
     'iri/Spleen': ['Spleen'],
     'iri/Lung': []}
    """
    by_uberon = {uberon_iri: [] for uberon_iri in all_uberon_iris}
    for name in search_organs:
        parent_iri = term_to_parent_iri.get(name)
        if parent_iri is None:
            print(
                f'Warning: search organ "{name}" not found in ontology organs endpoint; skipping.'
            )
        elif parent_iri in by_uberon:
            by_uberon[parent_iri].append(name)
    return by_uberon


###### CCF ######


def get_ccf_rows(url):
    response = requests.get(url, headers={'accept': 'application/json'})
    response.raise_for_status()
    return response.json()['results']['bindings']


def rekey_ccf(rows, child_to_parent_iri):
    """
    Key CCF reference organs by their parent organ's uberon IRI, resolving lateralized organs
    (e.g. left/right kidney) to their parent via the ontology endpoint so that has_iu_component
    lands on the descriptions.yaml organ.
    """
    by_uberon = {}
    for row in rows:
        organ_iri = obo_iri(row['representation_of']['value'])
        parent_iri = child_to_parent_iri.get(organ_iri, organ_iri)
        by_uberon[parent_iri] = row
    return by_uberon


###### Ontology descriptions ######


def get_ontology_info(ids):
    ontology_info = {}
    url_base = 'https://www.ebi.ac.uk/ols4/api/ontologies/uberon/terms/'
    for id in ids:
        # OLS expects the IRI to be double-URL-encoded.
        encoded = urllib.parse.quote(urllib.parse.quote(id, safe=''), safe='')
        response = requests.get(f'{url_base}{encoded}')
        response.raise_for_status()
        ontology_info[id] = response.json()
    return ontology_info


def get_definition(onto_info):
    """
    Pull the formal definition (IAO:0000115) for an OLS term. The `description` list also
    holds editorial comments and taxon notes -- sometimes listed before the definition -- so
    prefer `obo_definition_citation`, falling back to `description` only if no citation exists.

    >>> get_definition({'obo_definition_citation': [{'definition': 'The real definition.'}],
    ...                 'description': ['An editorial comment.', 'The real definition.']})
    'The real definition.'
    >>> get_definition({'description': ['Only a description.']})
    'Only a description.'
    >>> get_definition({}) is None
    True
    """
    citations = onto_info.get('obo_definition_citation') or []
    if citations:
        return citations[0].get('definition')
    description = onto_info.get('description') or []
    return description[0] if description else None


###### Utils #######


@dataclass
class Organ:
    """
    >>> organ = Organ(name='Small Intestine', data={'foo': 'bar'})
    >>> print(organ.yaml())
    name: Small Intestine
    foo: bar
    >>> print(organ.filename())
    small-intestine.yaml
    """

    name: str
    data: dict

    def yaml(self):
        return dump({'name': self.name, **self.data}, sort_keys=False).strip()

    def filename(self):
        return re.sub(r'\W+', ' ', self.name.lower()).strip().replace(' ', '-') + '.yaml'


def dir_path(s):
    path = Path(s)
    if path.is_dir():
        return path
    else:
        raise ValueError(f'"{s}" is not a directory')


class DirectoryWriter:
    def __init__(self, dir, organs):
        self.dir = dir
        self.organs = organs

    def write(self):
        for f in self.dir.glob('*'):
            f.unlink()
        note = f'Do not hand edit! Generated by {Path(__file__).name} on {
            datetime.now().isoformat()
        }.'
        for organ in self.organs:
            self.write_organ(organ, note)

    def write_organ(self, organ, note):
        file = self.dir / organ.filename()
        print(f'Writing to {file}...')
        file.write_text(f'# {note}\n\n' + organ.yaml())


if __name__ == '__main__':
    sys.exit(main())  # pragma: no cover
