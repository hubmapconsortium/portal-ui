import json

from nbformat.v4 import new_code_cell
import black


def _blocks_to_cells(code_blocks):
    '''
    Running code through black formats and catches syntax errors.

    >>> _blocks_to_cells(['No good!'])
    Traceback (most recent call last):
    ...
    black.parsing.InvalidInput: Cannot parse: 1:3: No good!

    >>> cells = _blocks_to_cells(['2 + 2'])
    >>> del cells[0]['id']
    >>> from pprint import pprint
    >>> pprint(cells[0])
    {'cell_type': 'code',
     'execution_count': None,
     'metadata': {},
     'outputs': [],
     'source': '2 + 2'}
    '''
    return [
        new_code_cell(black.format_str(code, mode=black.FileMode()).strip())
        for code in code_blocks
    ]


def get_shared_cells(uuids=None, url_base=None, entity_type=None):
    '''
    Return cells that should work for Donors, Samples, or Datasets.

    Confirm that there are no syntax errors:
    >>> cells = get_shared_cells(uuids=None, url_base=None, entity_type=None)
    '''
    return _blocks_to_cells([
        f"""
import json
from csv import DictReader, excel_tab
from io import StringIO
import requests
import pandas as pd

# These are the UUIDS of the search results when this notebook was created:

uuids = {json.dumps(uuids)}

""",
        f"""
# Fetch the metadata, and read it into a list of dicts:

response = requests.post(
             '{url_base}/metadata/v0/{entity_type}.tsv',
    json={{'uuids': uuids}})
metadata = list(DictReader(StringIO(response.text), dialect=excel_tab))

""",
        r'''
# The number of metadata dicts will correspond to the number of UUIDs requested:

len(metadata)

''',
        r'''
# Load it into a DataFrame and see the field definitions:

pd.DataFrame(metadata[:1]).T.head()

''',
        r'''
# Or review the data itself:

pd.DataFrame(metadata[1:])

'''
    ])


def get_file_cells(search_url):
    '''
    Return cells that only work for some Datasets.

    Confirm that there are no syntax errors:
    >>> cells = get_file_cells(search_url=None)
    '''
    return _blocks_to_cells([
        f'''
# The Search API can give us information about the files in processed datasets:

search_api = '{search_url}'

''',
        r'''
# The Search API supports Elasticsearch queries:

hits = json.loads(
    requests.post(
        search_api,
        json={'size': 10000, # To make sure the list is not truncted, set this high.
            'query': {'ids': {'values': uuids}},
            '_source': ['files']} # Documents are large, so only request the fields we need.
    ).text
)['hits']['hits']

''',
        r'''
# Only processed datasets have file information.

files = {
    hit["_id"]: {
        file['rel_path']: file['description'] for file in hit["_source"].get("files", []) if file
    } for hit in hits
}

# For example, the first 10 files from the first dataset:

list(list(files.values())[0].items())[:10] or 'No file information for these datasets.'

'''
    ])
