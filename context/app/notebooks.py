import json

from nbformat.v4 import new_code_cell
import black


def _blocks_to_cells(code_blocks):
    '''
    Running code through black formats and catches syntax errors.

    >>> _blocks_to_cells(['-> No good!'])
    ???
    '''
    return [
        new_code_cell(black.format_str(code, mode=black.FileMode()).strip())
        for code in code_blocks
    ]


def get_shared_cells(uuids=None, url_base=None, entity_type=None):
    return _blocks_to_cells([
        f"""
import json
from csv import DictReader, excel_tab
from io import StringIO
import requests

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
# Each dict will have the same keys. To see the first 10:

list(metadata[0].keys())[:10]

''',
        r'''
# We can get a definition for each of these keys:

metadata_key_defs = dict(zip(*[
    line.split('\t') for line in response.text.split('\n')[:2]
]))

# To see the first 10:

list(metadata_key_defs.items())[:10]

'''
    ])


def get_file_cells(search_url):
    return _blocks_to_cells([
        f'''
# The Search API can give us information about the files in processed dataset:

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

list(list(files.values())[0].items())[:10]

'''
    ])
