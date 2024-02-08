from flask import json, current_app, render_template
from hubmap_api_py_client import Client
from requests import post
from datetime import datetime
from asyncio import gather, to_thread

from .routes_file_based import _get_organ_list

from .utils import make_blueprint, get_client, get_default_flask_data


cells_client_env = 'dev'


def get_cells_client():
    # TODO: Since the `cell_type` lookup does not currently exist
    # outside of the dev environment, this is currently hardcoded
    # to use the dev endpoint.
    #
    # Once the `cell_type` lookup is available in the production
    # environment, these routes can be moved to `routes_cells`,
    # and this file can be deleted/removed from main.py.
    client = Client(f'https://cells.${cells_client_env}.hubmapconsortium.org/api/')
    return client

# NOTE: This file makes heavy use of async/await and asyncio.gather
# The purpose of this is to make independent API calls in parallel,
# since these requests are I/O bound and can thus be made concurrently
# to improve performance and reduce latency.
# The `to_thread` function is used to run synchronous code in a
# separate thread, and `gather` is used to wait for these threaded
# operations to complete.


blueprint = make_blueprint(__name__)


@blueprint.route('/cell-types/<cl_id>')
def cell_types_detail_view(cl_id):
    return render_template(
        'base-pages/react-content.html',
        title='Cell Type Details',
        flask_data={**get_default_flask_data(), 'cell_type': cl_id})


@blueprint.route('/genes/<gene_symbol>')
def genes_detail_view(gene_symbol):
    flask_data = {
        **get_default_flask_data(),
        'geneSymbol': gene_symbol
    }
    return render_template(
        'base-pages/react-content.html',
        title=gene_symbol,
        flask_data=flask_data
    )


# Fetches list of all cell types
@blueprint.route('/cell-types/list.json')
def cell_types_list():
    celltype_token_post = post(
        f'https://cells.{cells_client_env}.hubmapconsortium.org/api/celltype/',
        {}).json()
    celltype_token = celltype_token_post['results'][0]['query_handle']
    celltype_list = post(f'https://cells.{cells_client_env}.hubmapconsortium.org/api/celltypeevaluation/', {
        'key': celltype_token,
        'set_type': 'cell_type',
        'limit': 500}).json()['results']
    celltype_list = list(map(lambda x: x['grouping_name'], celltype_list))
    return celltype_list


# Handles detail page lookups for cell types, proteins, and genes
@blueprint.route('/x-modality/<feature>/<feature_id>.json', methods=['GET'])
async def get_feature_details(feature, feature_id):
    client = get_cells_client()
    feature = _feature_name(feature)
    if feature == 'cell_type':
        datasets, organs = await gather(
            _get_datasets_for_cell_type(client, feature_id),
            _get_organs_for_cell_type(client, feature_id))
        samples = _get_samples_for_datasets(datasets)
        return json.dumps({
            'datasets': datasets,
            'samples': samples,
            'organs': organs
        })
    elif feature == 'gene':
        organs = await _get_organs_for_gene(client, feature_id)

        additional = {}

        # Uncomment below to test gene cell type lookup times
        # datasets = await _get_datasets_for_gene(client, feature_id)
        # additional['datasets'] = datasets
        # additional['cell_types'] = await _get_cell_types_for_gene(client, feature_id, datasets)

        return json.dumps({
            'organs': organs,
            **additional
        })
    elif feature == 'protein':
        # TODO - not yet implemented
        # organs = _get_organs_for_protein(client, feature_id)
        # datasets = _get_datasets_for_protein(client, feature_id)
        return json.dumps({'organs': [],
                           'datasets': []})


# Fetches a list of datasets containing a given cell type
async def _get_datasets_for_cell_type(client, feature_id):
    def fetch_and_unwrap_datasets():
        datasets = client.select_datasets(
            where="cell_type", has=[feature_id])
        return _unwrap_result_set(datasets)
    return await to_thread(fetch_and_unwrap_datasets)


# Fetches a list of datasets containing a given gene
async def _get_datasets_for_gene(client, gene_symbol):
    def get_datasets_for_modality(modality):
        try:
            return client.select_datasets(
                where="gene", has=[f'{gene_symbol} > 1'],
                genomic_modality=modality, min_cell_percentage=1.0)
        except Exception as err:
            current_app.logger.info(
                f'Datasets not found for gene {gene_symbol} with {modality} modality. {err}')
            return []
    rna_datasets, atac_datasets = await gather(
        to_thread(get_datasets_for_modality, 'rna'),
        to_thread(get_datasets_for_modality, 'atac'))
    datasets = _combine_results(rna_datasets, atac_datasets)
    datasets = _unwrap_result_set(datasets)
    datasets = list(map(lambda x: x['uuid'], datasets))
    return datasets


async def _get_organs_for_cell_type(client, cell_type):
    # Fetches set of organs containing a given cell type
    def _get_organs_for_cell_type():
        try:
            organs = client.select_organs(
                where="cell_type", has=[cell_type])
            organs = _unwrap_result_set(organs)
            organs = list(map(lambda x: x['grouping_name'], organs))
            return organs
        except Exception as err:
            current_app.logger.info(
                f'Organs not found for cell type {cell_type}. {err}')
            return None

    # Fetches all cells of a given type
    def _get_cells_of_type():
        try:
            cells_of_type = client.select_cells(
                where="cell_type", has=[cell_type])
            return cells_of_type
        except Exception as err:
            current_app.logger.info(
                f'Cells not found for cell type {cell_type}. {err}')
            return None

    # Make above calls in parallel
    organs, cells_of_type = await gather(
        to_thread(_get_organs_for_cell_type),
        to_thread(_get_cells_of_type))

    if not cells_of_type or not organs:
        return []

    # Get cell counts for each organ
    def get_cell_counts(organ):
        organ_counts = client.select_cells(
            where="organ", has=[organ])
        total_cells = len(organ_counts)
        feature_cells = organ_counts & cells_of_type
        feature_cells = len(feature_cells)
        return {
            'organ': organ,
            'total_cells': total_cells,
            'feature_cells': feature_cells,
            'other_cells': total_cells - feature_cells
        }

    organs = await gather(
        *[to_thread(get_cell_counts, organ) for organ in organs]
    )
    return organs


# Fetches a list of organs containing a given gene in any modality
async def _get_organs_for_gene(client, gene_symbol):
    def request_organs_with_modality(modality):
        try:
            return client.select_organs(
                where='gene',
                has=[gene_symbol],
                genomic_modality=modality,
                p_value=0.05)
        except Exception as err:
            current_app.logger.info(
                f'Organs not found for gene {gene_symbol} with {modality} modality. {err}')
            return []
    organs_with_gene_atac, organs_with_gene_rna = await gather(
        to_thread(request_organs_with_modality, 'atac'),
        to_thread(request_organs_with_modality, 'rna'))
    if not organs_with_gene_atac and not organs_with_gene_rna:
        return []
    # Combine results from both modalities
    organs_with_gene = _combine_results(organs_with_gene_atac, organs_with_gene_rna)
    organs_with_gene = _unwrap_result_set(organs_with_gene)
    organs_with_gene = list(map(lambda x: x['grouping_name'], organs_with_gene))
    return _get_organ_list(organs_with_gene)


# Fetches a list of cell types expressing a given gene
# Not currently used since the API is not ready
async def _get_cell_types_for_gene(client, gene_symbol, datasets):
    if not datasets:
        print('No datasets found for gene', gene_symbol)
        return []
    try:
        # How many cells to fetch at a time
        genes_to_fetch = 1000
        # Minimum expression value for gene
        minimum_expression_value = 1000
        start = datetime.now()
        print(f'{datetime.now()} Gene {gene_symbol} found in {len(datasets)} datasets')

        # Get cells in passed list of datasets that express gene
        def get_cells_for_datasets():
            try:
                return client.select_cells(where="dataset", has=datasets)
            except Exception as err:
                current_app.logger.info(
                    f'Cells not found for gene {gene_symbol}. {err}')
                return []

        # Get cells expressing gene with a given modality
        def request_cells_with_modality(modality):
            try:
                return client.select_cells(
                    where="gene",
                    has=[f'{gene_symbol} > {minimum_expression_value}'],
                    genomic_modality=modality)
            except Exception as err:
                current_app.logger.info(
                    f'Cells not found for gene {gene_symbol} with {modality} modality. {err}')
                return []
        # Request sets of cells in parallel
        cells_in_datasets, rna_cells, atac_cells = await gather(
            to_thread(get_cells_for_datasets),
            to_thread(request_cells_with_modality, 'rna'),
            to_thread(request_cells_with_modality, 'atac'))
        print(f"{datetime.now()} Cells with {gene_symbol} in current datasets subset: ",
              len(cells_in_datasets))
        print(f"{datetime.now()} RNA Cells {gene_symbol} > {minimum_expression_value}: ",
              len(rna_cells))
        print(f"{datetime.now()} ATAC Cells {gene_symbol} > {minimum_expression_value}: ",
              len(atac_cells))
        cells = _combine_results(rna_cells, atac_cells)
        print(f'{datetime.now()} Total cells with {gene_symbol}: ', len(cells))
        cells = cells & cells_in_datasets
        count = len(cells)
        print(f"{datetime.now()} Cells with {gene_symbol} in current datasets subset: {count}")
        cells = cells.get_list()

        # Build a dictionary of cell types and the datasets and organs they are found in
        cell_types = {}
        print(f'Total time to get list of cells with {gene_symbol}: {datetime.now() - start}')

        # Extracts cell info from a batch of cells
        def extract_cell_info(starting_index, iteration_interval):
            batch_size = min(iteration_interval, count - starting_index)
            cell_batch = cells._get(batch_size, starting_index)
            for cell in cell_batch:
                cell_type, dataset, organ = cell['cell_type'], cell['dataset'], cell['organ']
                if cell_type not in cell_types:
                    datasets, organs = set(), set()
                    datasets.add(dataset)
                    organs.add(organ)
                    cell_types[cell_type] = {
                        "datasets": datasets,
                        "organs": organs,
                    }
                else:
                    cell_types[cell_type]["datasets"].add(dataset)
                    cell_types[cell_type]["organs"].add(organ)
            return cell_batch

        # Extract cell info in parallel
        await gather(
            *[to_thread(extract_cell_info, i, genes_to_fetch)
              for i in range(0, count, genes_to_fetch)]
        )

        end = datetime.now()
        print(f'{datetime.now()} Got cell types:', cell_types)
        print(f'{datetime.now()} Time to get cell types for gene {gene_symbol}: {end - start}')

        converted_cell_types = {}

        # Convert sets to lists for JSON serialization
        for cell_type in cell_types:
            converted_cell_types[cell_type] = {
                'datasets': [*(cell_types[cell_type]['datasets']), ],
                'organs': [*(cell_types[cell_type]['organs']), ]
            }

        return converted_cell_types

    except Exception as err:
        current_app.logger.info(f'Cell types not found for gene {gene_symbol}. {err}')
        return []


# Converts a resultset to a list
def _unwrap_result_set(result_set):
    if not result_set:
        return []
    length = len(result_set)
    result_list = result_set.get_list()._get(length, 0)
    return result_list


# Combines results from multiple modalities
def _combine_results(modality1, modality2):
    if not modality1 and not modality2:
        return None
    if not modality1:
        return modality2
    if not modality2:
        return modality1
    return modality1 | modality2


# Maps feature URL names to their corresponding API names
def _feature_name(feature):
    features = {
        'cell-types': 'cell_type',
        'proteins': 'protein',
        'genes': 'gene',
    }
    if feature in features:
        return features[feature]
    raise Exception(f'Feature {feature} not found.')


# Fetches a list of samples corresponding to a given list of dataset UUIDs
# TODO: This query could be made on the front-end, but this improvement
# is currently blocked by the API now requiring cell type names instead of CLIDs.
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
