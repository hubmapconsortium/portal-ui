from itertools import islice, groupby

from flask import render_template, current_app, request, jsonify

from hubmap_api_py_client import Client
from hubmap_api_py_client.errors import ClientError
import requests

from .utils import get_default_flask_data, make_blueprint, get_organs

blueprint = make_blueprint(__name__)


def _get_client(app):
    return Client(app.config['XMODALITY_ENDPOINT'] + '/api/')


@blueprint.route('/cell-types')
def cell_types_ui():
    organs = get_organs()
    return render_template(
        'base-pages/react-content.html',
        title='Cell Types',
        flask_data={**get_default_flask_data(), 'organs': organs}
    )


# Fetches list of all cell types
@blueprint.route('/cell-types/list.json')
def cell_types_list():
    celltype_token = requests.post(
        'https://cells.api.hubmapconsortium.org/api/celltype/', {}).json()['results'][0]['query_handle']
    celltype_list = [result['grouping_name'] for result in requests.post('https://cells.api.hubmapconsortium.org/api/celltypeevaluation/', {
        'key': celltype_token, 'set_type': 'cell_type', 'limit': 500}).json()['results']]
    return jsonify(celltype_list)


# Fetches dataset UUIDs for a given cell type
@blueprint.route('/cell-types/<cell_type>/datasets.json')
def cell_type_datasets(cell_type):
    client = _get_client(current_app)
    datasets = client.select_datasets(where='celltype', has=[cell_type]).get_list()
    datasets = [dataset['uuid'] for dataset in list(datasets)]

    return jsonify(datasets)


# Fetches list of organs for a given cell type
@blueprint.route('/cell-types/<cell_type>/organs.json')
def cell_type_organs(cell_type):
    client = _get_client(current_app)
    organs = [organ['grouping_name']
              for organ in client.select_organs(where='celltype', has=[cell_type]).get_list()]
    organs = [dataset for dataset in list(organs)]

    return jsonify(organs)


# Fetches list of genes for a given cell type
@blueprint.route('/cell-types/<cell_type>/genes.json')
def cell_type_genes(cell_type):
    client = _get_client(current_app)
    genes = [gene['grouping_name']
             for gene in client.select_genes(where='celltype', has=[cell_type]).get_list()]
    genes = [dataset for dataset in list(genes)]

    return jsonify(genes)


@blueprint.route('/cell-types/test.json')
def cell_types_test():
    client = _get_client(current_app)
    cells = client.select_cells(where='celltype', has=['Fibroblast']).get_list()[0:100]

    return jsonify(cells)
