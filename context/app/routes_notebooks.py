from flask import (abort, request, Response, current_app)
import nbformat
from nbformat.v4 import (new_notebook, new_markdown_cell, new_code_cell)

from .utils import make_blueprint, get_url_base_from_request, entity_types, get_client
from .notebooks import get_shared_cells, get_file_cells


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
        *vitessce_conf.cells
    ]

    return _nb_response(hubmap_id, cells)


@blueprint.route('/notebooks/<entity_type>.ipynb', methods=['POST'])
def notebook(entity_type):
    body = request.get_json()
    uuids = body.get('uuids')
    url_base = get_url_base_from_request()
    search_url = (
        current_app.config['ELASTICSEARCH_ENDPOINT']
        + current_app.config['PORTAL_INDEX_PATH'])
    cells = [
        new_markdown_cell(
            f'This notebook demonstrates how to work with HuBMAP APIs for {entity_type}:'),
        new_code_cell('!pip install requests pandas'),
        *get_shared_cells(uuids=uuids, url_base=url_base, entity_type=entity_type),
    ]
    if entity_type == 'datasets':
        cells += get_file_cells(search_url=search_url)
    return _nb_response(entity_type, cells)
