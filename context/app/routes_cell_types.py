from flask import json
from hubmap_api_py_client import Client

from .utils import make_blueprint, get_client


def get_cells_client():
    # TODO: This should be in config
    client = Client('https://cells.test.hubmapconsortium.org/api/')
    return client


blueprint = make_blueprint(__name__)


@blueprint.route('/cell-types/<cl_id>/datasets.json', methods=['GET'])
def get_datasets_with_cell_type(cl_id):
    client = get_cells_client()
    try:
        datasets = client.select_datasets(
            where="cell_type", has=[cl_id]).get_list()
        datasets = list(map(lambda x: x['uuid'], datasets._get(datasets.__len__(), 0)))
        return json.dumps(datasets)
    except:
        return json.dumps([])
