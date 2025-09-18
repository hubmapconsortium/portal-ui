from flask import json, current_app, render_template
from asyncio import gather, to_thread

from .routes_file_based import _get_organ_list
from .routes_cells import _get_client

from .utils import make_blueprint, get_client, get_default_flask_data


cells_client_env = 'dev'
cells_url = f'https://cells.{cells_client_env}.hubmapconsortium.org/api'
celltype_url = f'{cells_url}/celltype/'
celltype_eval_url = f'{cells_url}/celltypeevaluation/'


# NOTE: This file makes heavy use of async/await and asyncio.gather
# The purpose of this is to make independent API calls in parallel,
# since these requests are I/O bound and can thus be made concurrently
# to improve performance and reduce latency.
# The `to_thread` function is used to run synchronous code in a
# separate thread, and `gather` is used to wait for these threaded
# operations to complete.


blueprint = make_blueprint(__name__)


@blueprint.route('/cell-types')
def cell_types_view():
    return render_template(
        'base-pages/react-content.html',
        title='Cell Types',
        flask_data=get_default_flask_data())


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


# Handles detail page lookups for cell types, proteins, and genes
@blueprint.route('/x-modality/<feature>/<feature_id>.json', methods=['GET'])
async def get_feature_details(feature, feature_id):
    client = _get_client(current_app)
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

        return json.dumps({
            'organs': organs,
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
