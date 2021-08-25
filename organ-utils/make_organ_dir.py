#!/usr/bin/env python3

import argparse
from pathlib import Path
import sys
from datetime import date
from dataclasses import dataclass
import csv
from itertools import groupby

import requests
from yaml import dump


def main():
    parser = argparse.ArgumentParser(formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser.add_argument(
        '--target',
        type=dir_path,
        default=Path(__file__).parent.parent / 'context/app/organ',
        help='Target directory for markdown files')
    parser.add_argument(
        '--csv_url',
        default='https://hubmapconsortium.github.io/ccf-releases/v1.0/models/ASCT-B_3D_Models_Mapping.csv',
        help='ASCT+B Tables to 3D Reference Object Library Mapping CSV URL')
    parser.add_argument(
        '--es_url',
        default='https://search.api.hubmapconsortium.org/portal/search',
        help='ES endpoint to query for organs')
    args = parser.parse_args()

    es_organs = _get_es_organs(args.es_url)

    organ_data = _parse_asctb_rows(_get_asctb_rows(args.csv_url))
    organs = [
        Organ(
            title=title,
            stem=label.replace(' ', '-'),
            in_index=title in es_organs,
            instances=instances)
        for label, instances in organ_data.items()
        if (title := _label_to_es(label))
    ]
    DirectoryWriter(args.target, organs).write()


def _get_es_organs(es_url):
    agg_name = 'organs'
    response = requests.post(
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
    return [b['key'] for b in response['aggregations'][agg_name]['buckets']]


def _label_to_es(label):
    '''
    >>> _label_to_es('large intestine')
    'Large Intestine'
    >>> _label_to_es('right kidney')
    'Kidney (Right)'
    >>> _label_to_es('heart')
    'Heart'
    '''
    words = [w.capitalize() for w in label.split(' ')]
    if words[0] in ['Left', 'Right']:
        words.append(f'({words.pop(0)})')
    return ' '.join(words)


def _get_asctb_rows(csv_url):
    csv_path = Path(__file__).parent / 'asctb.csv'
    if not csv_path.exists():
        csv_lines = requests.get(csv_url).text.split('\n')
        for i, line in enumerate(csv_lines):
            # Skip the header rows...
            if line.startswith('anatomical_structure_of'):
                break
        data_lines = csv_lines[i:]
        csv_path.write_text('\n'.join(data_lines))
    return csv.DictReader(csv_path.open())


def _parse_asctb_rows(rows):
    '''
    >>> rows = [
    ...     {
    ...         'glb file of single organs': 'VH_F_Thymus',
    ...         'OntologyID': 'UBERON:0002370',
    ...         'label': 'thymus',
    ...         'anatomical_structure_of': '#VHFThymus'},
    ...     {
    ...         'glb file of single organs': 'VH_M_Thymus',
    ...         'OntologyID': 'UBERON:0002370',
    ...         'label': 'thymus',
    ...         'anatomical_structure_of': '#VHMThymus'},
    ...     {
    ...         'OntologyID': 'UBERON:0005457',
    ...         'label': 'left thymus lobe',
    ...         'anatomical_structure_of': '#VHMThymus'},
    ...     {
    ...         'OntologyID': 'UBERON:0005469',
    ...         'label': 'REPEAT!!!!!!!',
    ...         'anatomical_structure_of': '#VHMThymus'},
    ...     {
    ...         'OntologyID': 'UBERON:0005469',
    ...         'label': 'right thymus lobe',
    ...         'anatomical_structure_of': '#VHMThymus'}
    ... ]
    >>> from pprint import pp
    >>> pp(_parse_asctb_rows(rows))
    {'thymus': [{'id': '#VHFThymus',
                 'label': 'thymus',
                 'anatomy': {'UBERON:0002370': 'thymus'},
                 'glb': 'VH_F_Thymus',
                 'sex': 'Female'},
                {'id': '#VHMThymus',
                 'label': 'thymus',
                 'anatomy': {'UBERON:0002370': 'thymus',
                             'UBERON:0005457': 'left thymus lobe',
                             'UBERON:0005469': 'right thymus lobe'},
                 'glb': 'VH_M_Thymus',
                 'sex': 'Male'}]}
    '''
    get_anatomy = lambda row: row['anatomical_structure_of']
    rows = sorted(rows, key=get_anatomy)
    groups = [
        {
            'id': key,
            'label': label,
            'anatomy': {
                # Use dict to de-dupe.
                row['OntologyID']: row['label'] 
                for row in list_group
                if row['label']
            },
            'glb': glb,
            'sex': {'M': 'Male', 'F': 'Female'}[sex_abbr]
        }
        for key, group in groupby(rows, get_anatomy)
        if (list_group := list(group))
        # List order seems to matter, but I would prefer
        # a more reliable way of extracing the information...
        and (glb := list_group[0]['glb file of single organs'])
        and (label := list_group[0]['label'])
        # ... and this could be better, too. 
        and (sex_abbr := glb.split('_')[1])
    ]

    get_label = lambda group: group['label']
    groups = sorted(groups, key=get_label)
    m_f_pairs = {
        key: list(group)
        for key, group in groupby(groups, get_label)
    }
    return m_f_pairs


@dataclass
class Organ:
    stem: str
    title: str
    instances: list
    in_index: bool

    def yaml_front_matter(self):
        data = {
            'title': self.title,
            'instances': self.instances,
            'in_index': self.in_index
        }
        return f'---\n{dump(data)}---\n\n'

    def markdown(self):
        return f'# {self.title}\n\nTODO'


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
        readme_text = f'Generated by {Path(__file__).name} on {date.today()}.'
        (self.dir / 'README.txt').write_text(readme_text)
        for organ in self.organs:
            self._write_organ(organ)
    def _write_organ(self, organ):
        file = self.dir / f"{organ.stem}.md"
        print(f'Writing to {file}...')
        file.write_text(
            organ.yaml_front_matter()
            + organ.markdown()
        )
        

if __name__ == "__main__":
    sys.exit(main())  # pragma: no cover
