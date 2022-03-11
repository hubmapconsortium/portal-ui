from flask import (abort, request, Response, current_app)
import json
from pathlib import Path
from string import Template

import nbformat
from nbformat.v4 import (new_notebook, new_markdown_cell, new_code_cell)

from .utils import make_blueprint, get_url_base_from_request, entity_types, get_client


blueprint = make_blueprint(__name__)


def _nb_response_from_objs(name_stem, cells):
    nb = new_notebook()
    nb['cells'] = cells
    return _nb_response(name_stem, nbformat.writes(nb))


def _nb_response_from_dicts(name_stem, cells):
    nb = {
        'cells': cells,
        'metadata': {},
        'nbformat': 4,
        'nbformat_minor': 5
    }
    return _nb_response(name_stem, json.dumps(nb))


def _nb_response(name_stem, nb_str):
    return Response(
        response=nb_str,
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
        new_code_cell(
            '!pip uninstall community flask -y '
            '# Preinstalled on Colab; Cause version conflicts.\n'
            '!pip install vitessce'),
        *vitessce_conf.cells
    ]

    return _nb_response_from_objs(hubmap_id, cells)


@blueprint.route('/notebooks/<entity_type>.ipynb', methods=['POST'])
def notebook(entity_type):
    body = request.get_json()
    uuids = body.get('uuids')
    url_base = get_url_base_from_request()
    cells = _get_metadata_cells(uuids=uuids, url_base=url_base, entity_type=entity_type)
    if entity_type == 'datasets':
        search_url = (
            current_app.config['ELASTICSEARCH_ENDPOINT']
            + current_app.config['PORTAL_INDEX_PATH'])
        cells += _get_files_cells(search_url=search_url)
    return _nb_response_from_dicts(entity_type, cells)


def _get_metadata_cells(uuids=None, url_base=None, entity_type=None):
    uuids_str = str(uuids)
    template = Template((Path(__file__).parent / 'notebook/metadata.ipynb').read_text())
    filled = template.substitute(uuids=uuids_str, url_base=url_base, entity_type=entity_type)
    return json.loads(filled)['cells']


def _get_files_cells(search_url):
    template = Template((Path(__file__).parent / 'notebook/files.ipynb').read_text())
    filled = template.substitute(search_url=search_url)
    return json.loads(filled)['cells']
