from urllib.parse import urlparse
import json

from flask import (request, Response)

import nbformat
from nbformat.v4 import (new_notebook, new_markdown_cell, new_code_cell)

from .utils import make_blueprint


blueprint = make_blueprint(__name__)


def get_url_base_from_request():
    parsed = urlparse(request.base_url)
    scheme = parsed.scheme
    netloc = parsed.netloc
    return f'{scheme}://{netloc}'


@blueprint.route('/notebooks/<entity_type>.ipynb', methods=['POST'])
def notebook(entity_type):
    body = request.get_json()
    uuids = body.get('uuids')
    base = get_url_base_from_request()
    nb = new_notebook()
    nb['cells'] = [
        new_markdown_cell(f'This is how you can gather metadata for HuBMAP {entity_type}:'),
        new_code_cell('!pip install requests'),
        new_code_cell(
            f"""
from csv import DictReader, excel_tab
from io import StringIO
import requests

response = requests.post(
    '{base}/metadata/v0/{entity_type}.tsv',
    json={{'uuids':{json.dumps(uuids)}}})
metadata = list(DictReader(StringIO(response.text), dialect=excel_tab))

len(metadata)
metadata[0].keys()
""".strip())]
    return Response(
        response=nbformat.writes(nb),
        headers={'Content-Disposition': f"attachment; filename=metadata.ipynb"},
        mimetype='application/x-ipynb+json'
    )
