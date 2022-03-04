import json

from flask import (abort, request, Response)
import black
import nbformat
from nbformat.v4 import (new_notebook, new_markdown_cell, new_code_cell)

from .utils import make_blueprint, get_url_base_from_request, entity_types, get_client


blueprint = make_blueprint(__name__)


def _nb_response(name_stem, cells):
    nb = new_notebook()
    nb['cells'] = cells
    return Response(
        response=nbformat.writes(nb),
        headers={'Content-Disposition': f"attachment; filename={name_stem}.ipynb"},
        mimetype='application/x-ipynb+json'
    )


@blueprint.route('/browse/<type>/<uuid>.ipynb')
def details_notebook(type, uuid):
    if type not in entity_types:
        abort(404)
    client = get_client()
    entity = client.get_entity(uuid)
    vitessce_conf = client.get_vitessce_conf_cells_and_lifted_uuid(entity).vitessce_conf
    if (vitessce_conf is None
            or vitessce_conf.conf is None
            or vitessce_conf.cells is None):
        abort(404)

    hubmap_id = entity['hubmap_id']
    dataset_url = request.base_url.replace('.ipynb', '')
    cells = [
        new_markdown_cell(f"Visualization for [{hubmap_id}]({dataset_url})"),
        new_code_cell('!pip install vitessce'),
    ] + vitessce_conf.cells

    return _nb_response(hubmap_id, cells)


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
    cells = [
        new_markdown_cell(
            f'This notebook demonstrates how to work with HuBMAP APIs for {entity_type}:'),
        new_code_cell('!pip install requests'),
        *_code_cells([
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
    return _nb_response(entity_type, cells)
