from flask import json, current_app, render_template
from hubmap_api_py_client import Client
from requests import post

from .utils import make_blueprint, get_client, get_default_flask_data


def get_cells_client():
    # TODO: Since the `cell_type` lookup does not currently exist
    # outside of the test environment, this is currently hardcoded
    # to use the test endpoint.
    #
    # Once the `cell_type` lookup is available in the production
    # environment, these routes can be moved to `routes_cells`,
    # and this file can be deleted/removed from main.py.
    client = Client('https://cells.test.hubmapconsortium.org/api/')
    return client


blueprint = make_blueprint(__name__)


@blueprint.route('/cell-types/<cl_id>')
def cell_types_detail_view(cl_id):
    return render_template(
        'base-pages/react-content.html',
        title='Cell Type Details',
        flask_data={**get_default_flask_data(), 'cell_type': cl_id})


# Fetches list of all cell types
@blueprint.route('/cell-types/list.json')
def cell_types_list():
    celltype_token_post = post(
        'https://cells.test.hubmapconsortium.org/api/celltype/',
        {}).json()
    celltype_token = celltype_token_post['results'][0]['query_handle']
    celltype_list = post('https://cells.test.hubmapconsortium.org/api/celltypeevaluation/', {
        'key': celltype_token,
        'set_type': 'cell_type',
        'limit': 500}).json()['results']
    celltype_list = list(map(lambda x: x['grouping_name'], celltype_list))
    return celltype_list


@blueprint.route('/cell-types/<cl_id>/datasets.json', methods=['GET'])
def get_datasets_with_cell_type(cl_id):
    client = get_cells_client()
    try:
        datasets = client.select_datasets(
            where="cell_type", has=[cl_id]).get_list()
        datasets = list(map(lambda x: x['uuid'], datasets._get(datasets.__len__(), 0)))
        return json.dumps(datasets)
    except Exception as err:
        current_app.logger.info(f'Datasets not found for cell type {cl_id}. {err}')
        return json.dumps([])


@blueprint.route('/cell-types/<cl_id>/samples.json', methods=['GET'])
def get_samples_with_cell_type(cl_id):
    datasets = json.loads(get_datasets_with_cell_type(cl_id))
    client = get_client()
    try:
        query_override = {
            "bool": {
                "must": {
                    "terms": {
                        "descendant_ids": datasets
                    }
                }
            }
        }
        fields = ['uuid', 'hubmap_id', 'origin_samples_unique_mapped_organs',
                  'sample_category', 'last_modified_timestamp']
        samples = client.get_entities(plural_lc_entity_type='samples',
                                      query_override=query_override, non_metadata_fields=fields)
        samples = [{'uuid': sample['uuid'],
                    'hubmap_id': sample['hubmap_id'],
                    'organ': sample['origin_samples_unique_mapped_organs'],
                    'sample_category': sample['sample_category'],
                    'last_modified_timestamp': sample['last_modified_timestamp']
                    } for sample in samples]
        return json.dumps(samples)
    except Exception as err:
        current_app.logger.info(f'Samples not found for cell type {cl_id}. {err}')
        return json.dumps([])


@blueprint.route('/cell-types/<cl_id>/organs.json', methods=['GET'])
def get_organs_with_cell_type(cl_id):
    client = get_cells_client()
    try:
        # Get list of organs containing cell type
        organs = client.select_organs(
            where="cell_type", has=[cl_id]).get_list()
        organs = list(map(lambda x: x['grouping_name'], organs._get(organs.__len__(), 0)))
        cells_of_type = client.select_cells(
            where="cell_type", has=[cl_id])
        # Get counts of cell types in each organ
        for i, organ in enumerate(organs):
            organ_counts = client.select_cells(
                where="organ", has=[organ])
            total_cells = organ_counts.__len__()
            celltype_cells = organ_counts & cells_of_type
            celltype_cells = celltype_cells.__len__()
            organs[i] = {
                'organ': organ,
                'total_cells': total_cells,
                'celltype_cells': celltype_cells,
                'other_cells': total_cells - celltype_cells
            }

        return json.dumps(organs)
    except Exception as err:
        current_app.logger.info(f'Organs not found for cell type {cl_id}. {err}')
        return json.dumps([])
