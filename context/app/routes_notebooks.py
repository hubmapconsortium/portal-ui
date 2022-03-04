import json

from flask import (request, Response)
import black
import nbformat
from nbformat.v4 import (new_notebook, new_markdown_cell, new_code_cell)

from .utils import make_blueprint, get_url_base_from_request


blueprint = make_blueprint(__name__)

def _code_cells(code_blocks):
    # Running it through black will also catch syntax errors.
    return [
        new_code_cell(black.format_str(code, mode=black.FileMode()).strip())
        for code in code_blocks
    ]


@blueprint.route('/notebooks/<entity_type>.ipynb', methods=['POST'])
def notebook(entity_type):
    body = request.get_json()
    uuids = body.get('uuids')
    base = get_url_base_from_request()
    nb = new_notebook()
    nb['cells'] = [
        new_markdown_cell(f'This notebook demonstrates how to work with HuBMAP APIs for {entity_type}:'),
        new_code_cell('!pip install requests'),
        new_code_cell(
            f"""
import json
from csv import DictReader, excel_tab
from io import StringIO
import requests

# These are the UUIDS of the search results when this notebook was created:
uuids = {json.dumps(uuids)}
""".strip()),
        *_code_cells([
            r"""
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

''',
            r'''
# The Search API can give us information about the files in each dataset:
# TODO: Pull this from the environment.

search_api = 'https://search.api.hubmapconsortium.org/portal/search'

''',
            r'''
# Any Elasticsearch query can be used here:

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

'''])
    ]
    return Response(
        response=nbformat.writes(nb),
        headers={'Content-Disposition': f"attachment; filename={entity_type}.ipynb"},
        mimetype='application/x-ipynb+json'
    )
