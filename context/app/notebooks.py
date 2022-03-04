import json

from nbformat.v4 import new_code_cell
import black


def _blocks_to_cells(code_blocks):
    # Running it through black will also catch syntax errors.
    return [
        new_code_cell(black.format_str(code, mode=black.FileMode()).strip())
        for code in code_blocks
    ]


def get_shared_cells(uuids=None, base=None, entity_type=None):
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
             '{base}/metadata/v0/{entity_type}.tsv',
    json={{'uuids': uuids}})
metadata = list(DictReader(StringIO(response.text), dialect=excel_tab))

""",
        r'''
# The number of metadata dicts will correspond to the number of UUIDs requested:

len(metadata)

''',
        r'''
# Each dict will have the same keys:

metadata[0].keys()

''',
        r'''
# We can get a definition for each of these keys:

metadata_key_defs = dict(zip(*[
    line.split('\t') for line in response.text.split('\n')[:2]
]))

'''
    ])


def get_file_cells():
    return _blocks_to_cells([
        r'''
# The Search API can give us information about the files in each dataset:

search_api = 'https://search.api.hubmapconsortium.org/portal/search'

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
# File descriptions are also available for files, if needed: file['description']

files = {
    hit['_id']: [
        file['rel_path'] for file in hit['_source']['files']
    ] for hit in hits
}

'''
    ])