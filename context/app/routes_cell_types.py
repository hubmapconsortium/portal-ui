from flask import json, current_app, render_template
from hubmap_api_py_client import Client
from requests import post

from .routes_file_based import _get_organ_list

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
@blueprint.route('/x-modality/<feature>/<feature_id>.json', methods=['GET'])
def get_feature_details(feature, feature_id):
    client = get_cells_client()
    feature = feature_name(feature)
    try:
        datasets = _get_datasets(client, feature, feature_id)
        additional = {}
        if (feature == 'gene'):
            # Skip for now due to bugs with the API
            # additional['cell_types'] = _get_cell_types_for_gene(client, feature_id, datasets)
            additional['cell_types'] = []
        return json.dumps({
            'datasets': datasets,
            'samples': _get_samples_for_datasets(datasets),
            'organs': _get_organs(client, feature, feature_id),
            **additional  # Additional data for specific features
        })

    except Exception as err:
        current_app.logger.info(f'Datasets not found for {feature} {feature_id}. {err}')
        return json.dumps([])


# Fetches a list of dataset UUIDs for a given feature
def _get_datasets(client, feature, feature_id):
    try:
        if feature == 'cell_type':
            return _get_datasets_for_cell_type(client, feature_id)
        elif feature == 'gene':
            return _get_datasets_for_gene(client, feature_id)
        elif feature == 'protein':
            # TODO - not yet implemented
            # return _get_datasets_for_protein(client, feature_id)
            return []
    except Exception as err:
        current_app.logger.info(f'Datasets not found for {feature} {feature_id}. {err}')
        return []


# Fetches a list of datasets containing a given cell type
def _get_datasets_for_cell_type(client, feature_id):
    datasets = client.select_datasets(
        where="cell_type", has=[feature_id]).get_list()
    datasets = list(map(lambda x: x['uuid'], datasets._get(datasets.__len__(), 0)))
    return datasets


# Fetches a list of datasets containing a given gene
def _get_datasets_for_gene(client, gene_symbol):
    def get_datasets_for_modality(modality):
        try:
            return client.select_datasets(
                where="gene", has=[f'{gene_symbol} > 0.1'],
                genomic_modality=modality, min_cell_percentage=1.0)
        except Exception as err:
            current_app.logger.info(
                f'Datasets not found for gene {gene_symbol} with {modality} modality. {err}')
            return []
    rna_datasets = get_datasets_for_modality('rna')
    atac_datasets = get_datasets_for_modality('atac')
    datasets = _combine_results(rna_datasets, atac_datasets)
    datasets = _unwrap_result_set(datasets)
    datasets = list(map(lambda x: x['uuid'], datasets))
    return datasets


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
        return []


# Fetches a list of organs containing a given feature
def _get_organs(client, feature, feature_id):
    try:
        # Get list of organs containing cell type
        if feature == 'cell_type':
            organs = _get_organs_for_cell_type(client, feature_id)
            cells_of_type = _get_cells_of_type(client, feature_id)
            # Get counts of cell types in each organ
            for i, organ in enumerate(organs):
                organ_counts = client.select_cells(
                    where="organ", has=[organ])
                total_cells = len(organ_counts)
                feature_cells = organ_counts & cells_of_type
                feature_cells = len(feature_cells)
                organs[i] = {
                    'organ': organ,
                    'total_cells': total_cells,
                    'feature_cells': feature_cells,
                    'other_cells': total_cells - feature_cells
                }
            return organs
        elif feature == 'gene':
            organs = _get_organs_for_gene(client, feature_id)
            return organs
        elif feature == 'protein':
            # TODO - not yet implemented
            # return _get_organs_for_protein(client, id)
            return []
    except Exception as err:
        current_app.logger.info(f'Organs not found for {feature} {feature_id}. {err}')
        return []


def _get_organs_for_cell_type(client, cl_id):
    organs = client.select_organs(
        where="cell_type", has=[cl_id])
    organs = _unwrap_result_set(organs)
    organs = list(map(lambda x: x['grouping_name'], organs))
    return organs


# Fetches a list of organs containing a given gene
def _get_organs_for_gene(client, gene_symbol):
    def request_organs_with_modality(modality):
        try:
            return client.select_organs(
                where='gene', has=[gene_symbol], genomic_modality=modality, p_value=0.05)
        except Exception as err:
            current_app.logger.info(
                f'Organs not found for gene {gene_symbol} with {modality} modality. {err}')
            return []
    organs_with_gene_atac, organs_with_gene_rna = request_organs_with_modality(
        'atac'), request_organs_with_modality('rna')
    if not organs_with_gene_atac and not organs_with_gene_rna:
        return []
    # Combine results from both modalities
    organs_with_gene = _combine_results(organs_with_gene_atac, organs_with_gene_rna)
    organs_with_gene = _unwrap_result_set(organs_with_gene)
    organs_with_gene = list(map(lambda x: x['grouping_name'], organs_with_gene))
    return _get_organ_list(organs_with_gene)


# Fetches a list of cell types expressing a given gene
def _get_cell_types_for_gene(client, gene_symbol, datasets):
    if not datasets:
        return []
    try:
        # Get cells in passed list of datasets that express gene
        cells = client.select_cells(where="dataset", has=datasets)
        print("Cells with gene in current datasets subset: ", len(cells))
        cells = cells.get_list(values_included=[gene_symbol])
        print("After get_list", len(cells))
        cells = cells._get(cells.__len__(), 0)
        print("After unwrap", cells)
        cells = list(set(cells))
        print('Cell types for gene', gene_symbol, ':', cells)
        return cells
    except Exception as err:
        current_app.logger.info(f'Cell types not found for gene {gene_symbol}. {err}')
        return []


# Fetches all cells of a given type
def _get_cells_of_type(client, cl_id):
    cells_of_type = client.select_cells(
        where="cell_type", has=[cl_id])
    return cells_of_type


# Converts a resultset to a list
def _unwrap_result_set(result_set):
    length = len(result_set)
    result_list = result_set.get_list()._get(length, 0)
    return result_list


# Combines results from multiple modalities
def _combine_results(modality1, modality2):
    if not modality1:
        return modality2
    if not modality2:
        return modality1
    return modality1 | modality2
