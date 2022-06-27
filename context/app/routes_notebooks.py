from flask import (abort, request, Response, current_app)
import json
from pathlib import Path
from string import Template
import re

import nbformat
from nbformat.v4 import (new_notebook, new_markdown_cell, new_code_cell)

import vitessce

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
            '!pip uninstall community flask albumentations -y '
            '# Preinstalled on Colab; Causes version conflicts.\n'
            f'!pip install vitessce=={vitessce.__version__}'),
        *vitessce_conf.cells
    ]

    return _nb_response_from_objs(hubmap_id, cells)


@blueprint.route('/notebooks/<entity_type>.ipynb', methods=['POST'])
def notebook(entity_type):
    body = request.get_json()
    uuids = body.get('uuids')
    url_base = get_url_base_from_request()

    cells = _get_cells('metadata.ipynb', uuids=uuids, url_base=url_base, entity_type=entity_type)

    if entity_type == 'datasets':
        search_url = (
            current_app.config['ELASTICSEARCH_ENDPOINT']
            + current_app.config['PORTAL_INDEX_PATH'])
        cells += _get_cells('files.ipynb', search_url=search_url)

    uuids_to_files = get_client().get_files(uuids)
    uuids_to_zarr_files = _limit_to_zarr_files(uuids_to_files)
    zarr_files = set().union(*uuids_to_zarr_files.values())
    if zarr_files:
        cells += _get_cells('anndata.ipynb', uuids_to_zarr_files=uuids_to_zarr_files)

    return _nb_response_from_dicts(entity_type, cells)


def _limit_to_zarr_files(uuids_to_files):
    '''
    >>> uuids_to_files = {'1234': ['asdf/.zarr/abc', 'asdf/.zarr/xyz', 'other']}
    >>> _limit_to_zarr_files(uuids_to_files)
    {'1234': {'asdf/.zarr'}}
    '''
    return {
        uuid: set(
            re.sub(r'\.zarr/.*', '.zarr', f) for f in files
            if '.zarr' in f)
        for uuid, files in uuids_to_files.items()
    }


def _get_cells(filename, **kwargs):
    template = Template((Path(__file__).parent / 'notebook' / filename).read_text())
    filled = template.substitute(kwargs)
    return json.loads(filled)['cells']
