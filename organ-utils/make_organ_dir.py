#!/usr/bin/env python3

import argparse
from pathlib import Path
import sys
from datetime import date
from dataclasses import dataclass
import csv
from itertools import groupby
import re
from typing import DefaultDict

from bs4 import BeautifulSoup
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
        '--asctb_csv_url',
        default='https://hubmapconsortium.github.io/ccf-releases/v1.0/models/ASCT-B_3D_Models_Mapping.csv',
        help='ASCT+B Tables to 3D Reference Object Library Mapping CSV URL')
    parser.add_argument(
        '--elasticsearch_url',
        default='https://search.api.hubmapconsortium.org/portal/search',
        help='ES endpoint to query for organs')
    parser.add_argument(
        '--azimuth_url',
        default='https://azimuth.hubmapconsortium.org/references/',
        help='HTML to scrape for Azimuth references')
    args = parser.parse_args()

    search_data = \
        _parse_search_response(_get_search_response(args.elasticsearch_url))
    azimuth_data = _duplicate_azimuth(
        _parse_azimuth_html(_get_azimuth_html(args.azimuth_url)))
    asctb_data = \
        _parse_asctb_rows(_get_asctb_rows(args.asctb_csv_url))
    merged_data = _merge_data(
        search=search_data,
        azimuth=azimuth_data,
        asctb=asctb_data
    )

    organs = [
        Organ(
            title=title,
            data=data)
        for title, data in merged_data.items()
    ]
    DirectoryWriter(args.target, organs).write()


def _merge_data(**kwargs):
    '''
    >>> merged = _merge_data(
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


###### Azimuth #######

def _get_azimuth_html(url):
    html_path = Path(__file__).parent / 'azimuth.html'
    if not html_path.exists():
        html = requests.get(url).text
        soup = BeautifulSoup(html, features="lxml")
        html_path.write_text(soup.prettify())
    return html_path.read_text()


def _parse_azimuth_html(html):
    '''
    >>> html = """
    ...     <h2>Human - Funny Bone</h2>
    ...     <div>
    ...       <a class="app-btn"      href="http://example.com/app">App</a>
    ...       <a class="vitessce-btn" href="/vitessce"             >Reference</a>
    ...     </div>
    ... """
    >>> from pprint import pp
    >>> pp(_parse_azimuth_html(html))
    {'Funny Bone': {'app_url': 'http://example.com/app',
                    'vitessce_url': 'https://azimuth.hubmapconsortium.org/vitessce'}}
    '''
    soup = BeautifulSoup(html, features="lxml")
    titles = soup.find_all('h2')
    titles_buttons_div = {
        title.text.strip(): title.find_next('div')
        for title in titles
    }
    titles_links = {
        title.split(' - ')[1]: {
            f'{tool}_url':
                re.sub(
                    r'^/', 'https://azimuth.hubmapconsortium.org/',
                    button['href'])
            for tool in ['app', 'vitessce', 'zenodo', 'snakemake']
            if (button := div.find(class_=f'{tool}-btn'))
        }
        for title, div in titles_buttons_div.items()
        if 'Human' in title
    }
    return titles_links


def _duplicate_azimuth(data):
    for organ in ['Kidney', 'Lung']:
        organ_data = data.pop(organ)
        data[f'{organ} (Left)'] = organ_data
        data[f'{organ} (Right)'] = organ_data
    return data


###### Search #######

def _get_search_response(es_url):
    agg_name = 'organs'
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


def _parse_search_response(response):
    agg_name = 'organs'
    return {b['key']: True for b in response['aggregations'][agg_name]['buckets']}


###### ASCTB #######

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
    ...         'glb file of single organs': 'VH_F_Thymus.glb',
    ...         'OntologyID': 'UBERON:0002370',
    ...         'representation_of': 'http://purl.obolibrary.org/obo/UBERON_0002370',
    ...         'label': 'thymus',
    ...         'anatomical_structure_of': '#VHFThymus'},
    ...     {
    ...         'glb file of single organs': 'VH_M_Thymus.glb',
    ...         'OntologyID': 'UBERON:0002370',
    ...         'representation_of': 'http://purl.obolibrary.org/obo/UBERON_0002370',
    ...         'label': 'thymus',
    ...         'anatomical_structure_of': '#VHMThymus'},
    ...     {
    ...         'OntologyID': 'UBERON:0005457',
    ...         'representation_of': 'http://purl.obolibrary.org/obo/UBERON_0005457',
    ...         'label': 'left thymus lobe',
    ...         'anatomical_structure_of': '#VHMThymus'},
    ...     {
    ...         'OntologyID': 'UBERON:0005469',
    ...         'representation_of': 'http://purl.obolibrary.org/obo/UBERON_0005469',
    ...         'label': 'right thymus lobe',
    ...         'anatomical_structure_of': '#VHMThymus'}
    ... ]
    >>> from pprint import pp
    >>> pp(_parse_asctb_rows(rows))
    {'Thymus': [{'label': 'thymus',
                 'anatomy': {'thymus': 'http://purl.obolibrary.org/obo/UBERON_0002370'},
                 'glb_url': 'https://hubmapconsortium.github.io/ccf-releases/v1.0/models/VH_F_Thymus.glb',
                 'sex': 'Female'},
                {'label': 'thymus',
                 'anatomy': {'thymus': 'http://purl.obolibrary.org/obo/UBERON_0002370',
                             'left thymus lobe': 'http://purl.obolibrary.org/obo/UBERON_0005457',
                             'right thymus lobe': 'http://purl.obolibrary.org/obo/UBERON_0005469'},
                 'glb_url': 'https://hubmapconsortium.github.io/ccf-releases/v1.0/models/VH_M_Thymus.glb',
                 'sex': 'Male'}]}
    '''
    get_anatomy = lambda row: row['anatomical_structure_of']
    rows = sorted(rows, key=get_anatomy)
    groups = [
        {
            'label': label,
            'anatomy': {
                # Use dict to de-dupe.
                row['label']: row['representation_of']
                for row in list_group
                if row['label']
            },
            'glb_url': 'https://hubmapconsortium.github.io/ccf-releases/v1.0/models/' + glb,
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
        _label_to_es(key): list(group)
        for key, group in groupby(groups, get_label)
    }
    return m_f_pairs


###### Utils #######

@dataclass
class Organ:
    '''
    >>> organ = Organ(title='Kidney (Right)', data={'foo': 'bar'})
    >>> print(organ.yaml_front_matter())
    ---
    foo: bar
    ---
    <BLANKLINE>
    <BLANKLINE>

    >>> print(organ.markdown())
    # Kidney (Right)
    <BLANKLINE>
    TODO

    >>> print(organ.filename())
    kidney-right.md
    '''
    title: str
    data: dict

    def yaml_front_matter(self):
        return f'---\n{dump(self.data)}---\n\n'

    def markdown(self):
        return f'# {self.title}\n\nTODO'

    def filename(self):
        return re.sub(r'\W+', ' ', self.title.lower()).strip().replace(' ', '-') + '.md'


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
        file = self.dir / organ.filename()
        print(f'Writing to {file}...')
        file.write_text(
            organ.yaml_front_matter()
            + organ.markdown()
        )
        

if __name__ == "__main__":
    sys.exit(main())  # pragma: no cover
