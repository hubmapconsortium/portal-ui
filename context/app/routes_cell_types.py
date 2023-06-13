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


@blueprint.route('/cell-types/list.json')
def cell_types_list():
    celltype_token = requests.post(
        'https://cells.api.hubmapconsortium.org/api/celltype/', {}).json()['results'][0]['query_handle']
    print(celltype_token)
    celltype_list = [result['grouping_name'] for result in requests.post('https://cells.api.hubmapconsortium.org/api/celltypeevaluation/', {
        'key': celltype_token, 'set_type': 'cell_type', 'limit': 500}).json()['results']]
    return jsonify(celltype_list)
