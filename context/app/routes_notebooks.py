from flask import (abort, request, Response, current_app, session)
import json
from pathlib import Path
from string import Template
import re

from requests import post

import nbformat
from nbformat.v4 import (new_notebook, new_markdown_cell, new_code_cell)

from importlib.metadata import version 
import vitessce

from .utils import make_blueprint, get_url_base_from_request, entity_types, get_client


blueprint = make_blueprint(__name__)


def _nb_response_from_objs(name_stem, cells, workspace_name=None, uuids=[]):
    nb = new_notebook()
    nb['cells'] = cells
    nb_str = nbformat.writes(nb)
    return _nb_response(name_stem, nb_str, workspace_name, uuids)


def _nb_response_from_dicts(name_stem, cells, workspace_name=None, uuids=[]):
    nb = {
        'cells': cells,
        'metadata': {},
        'nbformat': 4,
        'nbformat_minor': 5
    }
    nb_str = json.dumps(nb)
    return _nb_response(name_stem, nb_str, workspace_name, uuids)


def _nb_response(name_stem, nb_str, workspace_name, uuids=[]):
    if not workspace_name:
        return Response(
            response=nb_str,
            headers={'Content-Disposition': f"attachment; filename={name_stem}.ipynb"},
            mimetype='application/x-ipynb+json'
        )
    # This route will only be exposed in the UI if logged in,
    # so we don't need to fall back gracefully.
    if not session['workspaces_token']:
        raise Exception('No workspaces_token')

    auth_headers = {'UWS-Authorization': f'Token {session["workspaces_token"]}'}
    workspaces_base_url = f'{current_app.config["WORKSPACES_ENDPOINT"]}/workspaces'

    notebook_path = f'{name_stem}.ipynb'
    create_workspace_response = post(
        workspaces_base_url,
        headers=auth_headers,
        json={
            'name': workspace_name,
            'description': workspace_name,
            'workspace_details': {
                'globus_groups_token': session['groups_token'],
                'files': [{
                    'name': notebook_path,
                    'content': nb_str,
                }],
                'symlinks': [{
                    "name": f"datasets/{uuid}",
                    "dataset_uuid": uuid
                } for uuid in uuids],
            }
        }
    )
    create_workspace_response.raise_for_status()
    workspace_id = create_workspace_response.json()['data']['workspace']['id']

    return {'workspace_id': workspace_id, 'notebook_path': notebook_path}


@blueprint.route(
    '/notebooks/entities/<entity_type>/<uuid>.ws.ipynb', methods=['POST'])
# TODO: Change to a single route, and instead make behavior depend on HTTP method
def entity_notebook(entity_type, uuid):
    if entity_type not in entity_types:
        abort(404)

    body = request.get_json()
    workspace_name = body.get('workspace_name')

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
        new_markdown_cell(
            f"Visualization for [{hubmap_id}]({dataset_url}); "
            "If this notebook is running in a HuBMAP workspace, the dataset is symlinked:"),
        new_code_cell(f'!ls datasets/{uuid}'),
        new_markdown_cell('Visualization requires extra code to be installed:'),
        new_code_cell(
            '!pip uninstall community flask albumentations -y '
            '# Preinstalled on Colab; Causes version conflicts.\n'
            f'!pip install vitessce[all]=={version("vitessce")}'),
        *vitessce_conf.cells
    ]

    return _nb_response_from_objs(hubmap_id, cells, workspace_name=workspace_name, uuids=[uuid])


@blueprint.route('/notebooks/entities/<entity_type>.ipynb', methods=['POST'])
def entities_notebook(entity_type):
    body = request.get_json()
    uuids = body.get('uuids')
    workspace_name = body.get('workspace_name')
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

    return _nb_response_from_dicts(entity_type, cells, workspace_name=workspace_name, uuids=uuids)


@blueprint.route('/notebooks/blank.ipynb', methods=['POST'])
def blank_notebook():
    body = request.get_json()
    workspace_name = body.get('workspace_name')

    cells = [new_markdown_cell(f"## {workspace_name}")]
    return _nb_response_from_dicts('notebook', cells, workspace_name=workspace_name)


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
