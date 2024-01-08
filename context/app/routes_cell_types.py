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


# Maps feature URL names to their corresponding API names
def feature_name(feature):
    features = {
        'cell-types': 'cell_type',
        'proteins': 'protein',
        'genes': 'gene',
    }
    if feature in features:
        return features[feature]
    raise Exception(f'Feature {feature} not found.')


# Handles detail page lookups for cell types, proteins, and genes
@blueprint.route('/x-modality/<feature>/<id>.json', methods=['GET'])
def get_feature_details(feature, id):
    client = get_cells_client()
    feature = feature_name(feature)
    try:
        datasets = _get_datasets(client, feature, id) or []
        return json.dumps({
            'datasets': datasets,
            'samples': _get_samples_for_datasets(datasets),
            'organs': _get_organs_with_feature(feature, id)
        })

    except Exception as err:
        current_app.logger.info(f'Datasets not found for {feature} {id}. {err}')
        return json.dumps([])


# Fetches a list of dataset UUIDs for a given feature
def _get_datasets(client, feature, id):
    try:
        datasets = client.select_datasets(
            where=feature, has=[id]).get_list()
        datasets = list(map(lambda x: x['uuid'], datasets._get(datasets.__len__(), 0)))
        return datasets
    except Exception as err:
        current_app.logger.info(f'Datasets not found for {feature} {id}. {err}')
        return []


# Fetches a list of samples corresponding to a given list of dataset UUIDs
def _get_samples_for_datasets(datasets):
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
        return samples
    except Exception as err:
        current_app.logger.info(f'Samples not found for {datasets}. {err}')
        return json.dumps([])


# Fetches a list of organs containing a given feature
def _get_organs_with_feature(feature, id):
    client = get_cells_client()
    try:
        # Get list of organs containing cell type
        organs = client.select_organs(
            where=feature, has=[id]).get_list()
        organs = list(map(lambda x: x['grouping_name'], organs._get(organs.__len__(), 0)))
        cells_of_type = client.select_cells(
            where=feature, has=[id])
        # Get counts of cell types in each organ
        for i, organ in enumerate(organs):
            organ_counts = client.select_cells(
                where="organ", has=[organ])
            total_cells = organ_counts.__len__()
            feature_cells = organ_counts & cells_of_type
            feature_cells = feature_cells.__len__()
            organs[i] = {
                'organ': organ,
                'total_cells': total_cells,
                'feature_cells': feature_cells,
                'other_cells': total_cells - feature_cells
            }

        return json.dumps(organs)
    except Exception as err:
        current_app.logger.info(f'Organs not found for cell type {id}. {err}')
        return json.dumps([])
