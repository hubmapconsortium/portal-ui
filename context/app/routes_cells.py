from itertools import groupby
from posixpath import dirname
import time

from flask import render_template, current_app, request, redirect, url_for
# from asyncio import gather, to_thread

from hubmap_api_py_client import Client
from hubmap_api_py_client.errors import ClientError

from .utils import first_n_matches, get_default_flask_data, make_blueprint

from operator import itemgetter

from collections import defaultdict

from dataclasses import dataclass

from functools import cache

from csv import DictReader


blueprint = make_blueprint(__name__)

# Cache for genes that are known to be invalid for specific modalities
# Structure: {modality: {gene1, gene2, ...}}
_INVALID_GENES_CACHE = defaultdict(set)


def _add_invalid_gene_to_cache(gene, modality):
    """Add a gene to the invalid genes cache for a specific modality."""
    _INVALID_GENES_CACHE[modality].add(gene)


def _is_gene_cached_as_invalid(gene, modality):
    """Check if a gene is already known to be invalid for a specific modality."""
    return gene in _INVALID_GENES_CACHE[modality]


def _filter_genes_by_cache(genes, modality):
    """
    Filter genes based on cache, returning (genes_to_test, known_invalid_genes).

    Args:
        genes: List of genes to filter
        modality: The modality to check against

    Returns:
        tuple: (genes_to_test, known_invalid_genes)
    """
    genes_to_test = []
    known_invalid_genes = []

    for gene in genes:
        if _is_gene_cached_as_invalid(gene, modality):
            known_invalid_genes.append(gene)
        else:
            genes_to_test.append(gene)

    return genes_to_test, known_invalid_genes


def _get_cache_stats():
    """Get statistics about the invalid genes cache for debugging."""
    stats = {}
    for modality, genes in _INVALID_GENES_CACHE.items():
        stats[modality] = len(genes)
    return stats


@blueprint.route('/search/biomarkers-cell-types')
def cells_ui():
    return render_template(
        'base-pages/react-content.html',
        title='Biomarker and Cell Type Search',
        flask_data={**get_default_flask_data()}
    )


@blueprint.route('/cells')
def cells_redirect():
    return redirect(url_for('routes_cells.cells_ui'), code=301)


@blueprint.route('/biomarkers')
def biomarkers_ui():
    return render_template(
        'base-pages/react-content.html',
        title='Biomarkers',
        flask_data={**get_default_flask_data()}
    )


def _get_client(app):
    return Client(app.config['XMODALITY_ENDPOINT'] + '/api/')


def timeit(f):
    def timed(*args, **kwargs):
        limit = 20
        str_args = [str(arg) for arg in args]
        trunc_args = [arg[:limit] + ('...' if len(arg) > limit else '') for arg in str_args]
        trunk_kwargs = [f'{k}=...' for k in kwargs]
        url = f'{request.path}?{request.query_string.decode("UTF-8")}'
        func = f'{f.__name__}({", ".join(trunc_args + trunk_kwargs)})'

        current_app.logger.info(' | '.join(['START', url, func]))

        start = time.time()
        result = f(*args, **kwargs)
        end = time.time()

        elapsed = f'{round(end - start, 3)} seconds'
        current_app.logger.info(' | '.join([elapsed, url, func]))
        return result
    return timed


@timeit
def preload_cells_api(app):
    # Preload the gene symbols, protein IDs, and cell IDs on server startup
    # so that they are immediately available when the user starts typing.

    funcs = [_get_gene_symbols, _get_protein_ids, _get_cell_ids]

    for func in funcs:
        func(app)


@timeit
@cache
def _get_gene_symbols(app):
    client = _get_client(app)
    gene_symbols = tuple([gene["gene_symbol"] for gene in client.select_genes().get_list()])
    return gene_symbols


@timeit
@cache
def _get_protein_ids(app):
    client = _get_client(app)
    protein_ids = tuple([protein["protein_id"] for protein in client.select_proteins().get_list()])
    return protein_ids


@cache
def _get_all_labels():
    # NOTE: all_labels.csv is sourced from
    # https://github.com/hubmapconsortium/azimuth-annotate/blob/main/data/all_labels.csv
    with open(f'{dirname(__file__)}/all_labels.csv') as f:
        # Read in each row as a dictionary and store them in a list
        all_labels = DictReader(f, delimiter=',', fieldnames=[
                                'Organ_Level', 'A_L', 'A_ID', 'Label', 'CL_ID', 'CL_Match'])
        all_labels = tuple(all_labels)
    return all_labels


@timeit
@cache
def _get_cell_ids(app):
    client = _get_client(app)
    cell_label_ids = [cell["grouping_name"] for cell in client.select_celltypes().get_list()]
    all_labels = _get_all_labels()
    # Filter labels to only include the ones that are in the cell_label_ids
    all_labels = tuple([label for label in all_labels if label['CL_ID'] in cell_label_ids])
    # Add the CL_ID to the label
    for label in all_labels:
        label['Lookup_Label'] = f'{label["Label"]} ({label["CL_ID"]})'
    # Remove any duplicate labels for the same CLID
    # while keeping  the one with the shortest name
    # since the input for the cells API only uses the CLID, having these variants
    # as separate options is unnecessary and confusing to the user
    labels_to_remove = []
    for label in all_labels:
        duplicate_clids = [lab for lab in all_labels if lab['CL_ID']
                           == label['CL_ID']]
        if len(duplicate_clids) > 1:
            duplicate_clids = sorted(
                duplicate_clids, key=lambda x: len(x['Label']))
            for lab in duplicate_clids[1:]:
                # Azimuth ID's are unique, so we can use them to remove the duplicates
                labels_to_remove.append(lab["A_ID"])
    all_labels = [label for label in all_labels if label["A_ID"] not in labels_to_remove]

    return all_labels


@dataclass
class Cluster:
    name: str
    number: int

    def __iter__(self):
        return iter((self.name, self.number))


def _get_cluster_name_and_number(cluster_str):
    '''
    >>> n_n = _get_cluster_name_and_number('cluster-name-number')
    >>> n_n.name
    'cluster-name'
    >>> n_n.number
    'number'
    '''
    cluster_name_arr = cluster_str.split('-')
    cluster_number = cluster_name_arr.pop()
    cluster_name = '-'.join(cluster_name_arr)
    return Cluster(name=cluster_name, number=cluster_number)


@timeit
def _get_cluster_cells(cells=None, cell_variable_name=None, min_expression=None):
    '''
    >>> cells = _get_cluster_cells(cells=[
    ...         {
    ...             "clusters": [
    ...                 "cluster-method-a-1",
    ...                 "cluster-method-b-1"
    ...             ],
    ...             "values": {
    ...                 "VIM": 21.0
    ...             }
    ...         },
    ...                 {
    ...             "clusters": [
    ...                 "cluster-method-a-1",
    ...                 "cluster-method-b-2"
    ...             ],
    ...             "values": {
    ...                 "VIM": 12.0
    ...             }
    ...         },
    ...         {
    ...             "clusters": [
    ...                 "cluster-method-a-1",
    ...                 "cluster-method-b-1"
    ...             ],
    ...             "values": {
    ...                 "VIM": 7.0
    ...             }
    ...         }], cell_variable_name='VIM', min_expression=10)
    >>> import pprint
    >>> pprint.pprint(cells)
    [{'cluster_name': 'cluster-method-a',
      'cluster_number': '1',
      'meets_minimum_expression': True,
      'modality': None},
     {'cluster_name': 'cluster-method-b',
      'cluster_number': '1',
      'meets_minimum_expression': True,
      'modality': None},
     {'cluster_name': 'cluster-method-a',
      'cluster_number': '1',
      'meets_minimum_expression': True,
      'modality': None},
     {'cluster_name': 'cluster-method-b',
      'cluster_number': '2',
      'meets_minimum_expression': True,
      'modality': None},
     {'cluster_name': 'cluster-method-a',
      'cluster_number': '1',
      'meets_minimum_expression': False,
      'modality': None},
     {'cluster_name': 'cluster-method-b',
      'cluster_number': '1',
      'meets_minimum_expression': False,
      'modality': None}]
    '''
    cluster_cells = []
    for cell in cells:
        for cluster in cell['clusters']:
            cluster_name, cluster_number = _get_cluster_name_and_number(cluster)
            cluster_cell = {'cluster_name': cluster_name,
                            'cluster_number': cluster_number,
                            'meets_minimum_expression':
                            cell['values'][cell_variable_name] >= min_expression,
                            'modality': cell.get('modality')}
            cluster_cells.append(cluster_cell)
    return cluster_cells


@timeit
def _get_matched_cell_counts_per_cluster(cells):
    '''
    >>> clusters = _get_matched_cell_counts_per_cluster(cells=[
    ...         {
    ...             'modality': 'Z',
    ...             'cluster_name': 'cluster-method-a',
    ...             'cluster_number': '1', 'meets_minimum_expression': True
    ...         },
    ...         {
    ...             'modality': 'Z',
    ...             'cluster_name': 'cluster-method-b',
    ...             'cluster_number': '1', 'meets_minimum_expression': True
    ...         },
    ...         {
    ...             'modality': 'Z',
    ...             'cluster_name': 'cluster-method-a',
    ...             'cluster_number': '1', 'meets_minimum_expression': True
    ...         },
    ...         {
    ...             'modality': 'Z',
    ...             'cluster_name': 'cluster-method-b',
    ...             'cluster_number': '2', 'meets_minimum_expression': True
    ...         },
    ...         {
    ...             'modality': 'Z',
    ...             'cluster_name': 'cluster-method-a',
    ...             'cluster_number': '1', 'meets_minimum_expression': False
    ...         },
    ...         {
    ...             'modality': 'Z',
    ...             'cluster_name': 'cluster-method-b',
    ...             'cluster_number': '1', 'meets_minimum_expression': False
    ...         },
    ...     ])
    >>> import pprint
    >>> pprint.pprint(dict(clusters))
    {'cluster-method-a': [{'cluster_name': 'cluster-method-a',
                           'cluster_number': '1',
                           'matched': 2,
                           'modality': 'Z',
                           'unmatched': 1}],
     'cluster-method-b': [{'cluster_name': 'cluster-method-b',
                           'cluster_number': '1',
                           'matched': 1,
                           'modality': 'Z',
                           'unmatched': 1},
                          {'cluster_name': 'cluster-method-b',
                           'cluster_number': '2',
                           'matched': 1,
                           'modality': 'Z',
                           'unmatched': 0}]}
    '''
    group_keys = ["cluster_name", "cluster_number", "modality"]
    grouper = itemgetter(*group_keys)
    clusters = defaultdict(lambda: [])
    for key, grp in groupby(sorted(cells, key=grouper), grouper):
        is_annotation = key[0] == ''
        grp_list = list(grp)
        # Re-format the annotation cluster set
        if (is_annotation):
            cluster_name = 'Annotation'
            key = (cluster_name, translate_clid(key[1]), key[2])
            grp_list = [{
                'cluster_name': 'Annotation',
                'cluster_number': translate_clid(item['cluster_number']),
                'modality': item['modality'],
                'meets_minimum_expression': item['meets_minimum_expression']
            } for item in grp_list]
        cluster = dict(zip(group_keys, key))
        matched_count = [item['meets_minimum_expression'] for item in grp_list].count(True)
        cluster.update({
            'matched': matched_count,
            'unmatched': len(grp_list) - matched_count
        })
        clusters[cluster['cluster_name']].append(cluster)
    return clusters


@timeit
@blueprint.route('/cells/genes-by-substring.json', methods=['POST'])
def genes_by_substring():
    substring = request.args.get('substring')
    return {'results': first_n_matches(_get_gene_symbols(current_app), substring, 10)}


@timeit
@blueprint.route('/cells/proteins-by-substring.json', methods=['POST'])
def proteins_by_substring():
    substring = request.args.get('substring')
    return {'results': first_n_matches(_get_protein_ids(current_app), substring, 10)}


@timeit
@blueprint.route('/cells/cell-types-by-substring.json', methods=['POST'])
def cell_types_by_substring():
    substring = request.args.get('substring')
    cell_types = _get_cell_ids(current_app)
    results = first_n_matches([cell['Lookup_Label'] for cell in cell_types], substring, 10)
    return {'results': results}


@timeit
@blueprint.route('/cells/genes/validate', methods=['POST'])
def genes_validate():
    """
    Endpoint to validate which genes from a provided list exist in the Cells API
    and are indexed for the specified modality.

    Expects JSON body:
        {
            "genes": ["GENE1", "GENE2", "UNKNOWN_GENE", ...],
            "modality": "rna" (optional, defaults to "rna")
        }

    Returns:
        JSON object with validation results:
        {
            "valid_genes": ["GENE1", ...],
            "invalid_genes": ["UNKNOWN_GENE", ...],
            "total_provided": 10,
            "total_valid": 8
        }
    """
    try:
        if not request.is_json:
            return {'error': 'Request must be JSON'}, 400

        data = request.get_json()
        if not data or 'genes' not in data:
            return {'error': 'Missing "genes" array in request body'}, 400

        provided_genes = data['genes']
        if not isinstance(provided_genes, list):
            return {'error': '"genes" must be an array'}, 400

        # Get modality from request, default to 'rna'
        modality = data.get('modality', 'rna')

        # Get all valid genes from the Cells API
        all_genes = _get_gene_symbols(current_app)
        all_genes_set = set(all_genes)

        # First filter: check if genes exist in gene symbols
        existing_genes = []
        missing_genes = []

        for gene in provided_genes:
            if isinstance(gene, str) and gene in all_genes_set:
                existing_genes.append(gene)
            else:
                missing_genes.append(gene)

        # Second filter: check if existing genes are indexed for the specified modality
        valid_genes = []
        modality_missing_genes = []

        # Helper function to add problematic genes to invalid list / cache
        def handle_invalid(gene, modality):
            modality_missing_genes.append(gene)
            _add_invalid_gene_to_cache(gene, modality)
            current_app.logger.info(
                f"Gene '{gene}' not indexed for modality '{modality}'"
            )

        if existing_genes:
            # Use cache to filter out genes we already know are invalid for this modality
            genes_to_test, known_invalid_genes = _filter_genes_by_cache(existing_genes, modality)
            modality_missing_genes.extend(known_invalid_genes)

            if known_invalid_genes:
                current_app.logger.info(
                    f"Found {len(known_invalid_genes)} genes in invalid cache for "
                    f"modality '{modality}': {known_invalid_genes}"
                )

            if genes_to_test:
                client = _get_client(current_app)

                # Test genes in batches to avoid overwhelming the API
                batch_size = 10
                for i in range(0, len(genes_to_test), batch_size):
                    batch_genes = genes_to_test[i:i + batch_size]

                try:
                    # Try to query the genes with the specified modality
                    # This will raise an exception if any gene is not indexed for this modality
                    client.select_datasets(
                        where="gene",
                        has=[f'{gene} > 0' for gene in batch_genes],
                        genomic_modality=modality,
                        min_cell_percentage=0.01  # Very low threshold just to test indexing
                    )

                    # If the query succeeds, all genes in this batch are valid
                    valid_genes.extend(batch_genes)

                except ClientError as e:
                    # If the batch query fails, try to parse which gene is problematic
                    # from the error message and retry with remaining genes
                    error_message = str(e)
                    current_app.logger.info(
                        f"Batch query failed for {batch_genes}: {error_message}"
                    )

                    # Try to extract the problematic gene from error message
                    # Look for patterns like "GENE_NAME not present in rna index"
                    import re
                    match = re.search(r'(\w+) not present in \w+ index', error_message)

                    if match and len(batch_genes) > 1:
                        problematic_gene = match.group(1)
                        if problematic_gene in batch_genes:
                            handle_invalid(problematic_gene, modality)

                            # Retry with remaining genes
                            remaining_genes = [g for g in batch_genes if g != problematic_gene]
                            if remaining_genes:
                                try:
                                    client.select_datasets(
                                        where="gene",
                                        has=[f'{gene} > 0' for gene in remaining_genes],
                                        genomic_modality=modality,
                                        min_cell_percentage=0.01
                                    )
                                    # If retry succeeds, all remaining genes are valid
                                    valid_genes.extend(remaining_genes)
                                except ClientError:
                                    # If retry still fails, fall back to individual testing
                                    for gene in remaining_genes:
                                        try:
                                            client.select_datasets(
                                                where="gene",
                                                has=[f'{gene} > 0'],
                                                genomic_modality=modality,
                                                min_cell_percentage=0.01
                                            )
                                            valid_genes.append(gene)
                                        except ClientError:
                                            handle_invalid(gene, modality)
                        else:
                            # Problematic gene not in our batch, fall back to individual testing
                            for gene in batch_genes:
                                try:
                                    client.select_datasets(
                                        where="gene",
                                        has=[f'{gene} > 0'],
                                        genomic_modality=modality,
                                        min_cell_percentage=0.01
                                    )
                                    valid_genes.append(gene)
                                except ClientError:
                                    handle_invalid(gene, modality)
                    else:
                        # Can't parse error or single gene batch, fall back to individual testing
                        for gene in batch_genes:
                            try:
                                client.select_datasets(
                                    where="gene",
                                    has=[f'{gene} > 0'],
                                    genomic_modality=modality,
                                    min_cell_percentage=0.01
                                )
                                valid_genes.append(gene)
                            except ClientError:
                                handle_invalid(gene, modality)

        # Combine all invalid genes
        invalid_genes = missing_genes + modality_missing_genes

        return {
            'valid_genes': valid_genes,
            'invalid_genes': invalid_genes,
            'total_provided': len(provided_genes),
            'total_valid': len(valid_genes)
        }
    except Exception as e:
        current_app.logger.error(f"Error in gene validation: {e}")
        return {'error': 'Failed to validate genes'}, 500


@timeit
@blueprint.route('/cells/datasets-selected-by-<target_entity>.json', methods=['POST'])
def datasets_selected_by_level(target_entity):
    cell_variable_names = request.args.getlist('cell_variable_name')
    modality = request.args.get('modality')
    min_expression = request.args.get('min_expression')
    min_cell_percentage = request.args.get('min_cell_percentage')

    client = _get_client(current_app)

    try:
        if target_entity == 'cell-type':
            dataset_set = client.select_datasets(
                where="cell_type",
                has=[translate_label(name) for name in cell_variable_names]
            )
            matched_datasets = dataset_set.get_list()
            total_datasets = len(client.select_datasets())
            results = {
                'matching': len(matched_datasets),
                'total': total_datasets,
                'list': list(matched_datasets)
            }

        else:
            dataset_set = client.select_datasets(
                where=target_entity,
                has=[f'{name} > {min_expression}'
                     for name in cell_variable_names],
                genomic_modality=modality,
                min_cell_percentage=min_cell_percentage
            )
            results = list(dataset_set.get_list())
    except ClientError as e:
        # TODO: We want to distinguish the expected errors
        # (like 4xx: "ABALON not present in rna index")
        # from unexpected errors (like any 5xx).
        # That needs to be done upstream in the API Client,
        # but for now, we want to turn something around quickly.
        # In the long run, we don't want to expose internal error messages in the UI.
        # https://github.com/hubmapconsortium/hubmap-api-py-client/issues/75
        return {'message': str(e)}
    return {'results': results}


@timeit
@blueprint.route('/cells/cell-percentages-for-datasets.json', methods=['POST'])
def cell_percentages_for_datasets():
    # Select a set of datasets where cells express a given gene,
    # and for each dataset, give the percentage of matching cells.

    uuids = request.args.getlist('uuid')
    gene_name = request.args.get('gene_name')
    min_gene_expression = request.args.get('min_gene_expression')

    client = _get_client(current_app)

    dataset_set = client.select_datasets(where='dataset', has=[uuids])
    results = list(dataset_set.get_list(
        values_included=[f'{gene_name} > {min_gene_expression}'])
    )

    return {'results': results}


@timeit
@blueprint.route('/cells/cell-expression-in-dataset.json', methods=['POST'])
def cell_expression_in_dataset():
    # For a single dataset we want to get the expression level of a given gene for all cells.
    # (In our discussion, we started by thinking about the set of matching cells,
    # and then showing expression levels for the two groups, but that’s not needed.)

    uuid = request.args.get('uuid')
    cell_variable_names = request.args.getlist('cell_variable_names')

    client = _get_client(current_app)

    cells = client.select_cells(where='dataset', has=[uuid])
    # list() will call iterator behind the scenes.
    results = list(cells.get_list(values_included=cell_variable_names))
    results = [{**x, 'cell_type': translate_clid(x['cell_type'])} for x in results]
    return {'results': results}


@timeit
@blueprint.route('/cells/all-indexed-uuids.json', methods=['POST'])
def all_indexed_uuids():
    # Get all UUIDs that have been indexed. Because of the delay in indexing,
    # we can't assume that all datasets of any particular type have been indexed.

    client = _get_client(current_app)

    datasets = client.select_datasets()
    # list() will call iterator behind the scenes.
    return {'results': list(datasets.get_list())}


@timeit
@blueprint.route('/cells/cells-in-dataset-clusters.json', methods=['POST'])
def cells_in_dataset_clusters():
    # For a single dataset we want to get the expression level of a given gene for all cells.
    # (In our discussion, we started by thinking about the set of matching cells,
    # and then showing expression levels for the two groups, but that’s not needed.)

    uuid = request.args.get('uuid')
    cell_variable_name = request.args.get('cell_variable_name')
    min_expression = request.args.get('min_expression')
    client = _get_client(current_app)

    cells = client.select_cells(where='dataset', has=[uuid])
    cells_list = cells.get_list(values_included=cell_variable_name)

    return {'results':
            _get_matched_cell_counts_per_cluster(
                cells=_get_cluster_cells(cells=cells_list,
                                         cell_variable_name=cell_variable_name,
                                         min_expression=float(min_expression)))}


@timeit
@blueprint.route('/cells/all-names-for-cell-type.json', methods=['POST'])
def get_all_names_for_cell_type():
    label = request.args.get('cell_type')
    clid = translate_label(label)

    return {'results': _get_all_names_for_clid(clid)}


@cache
def translate_clid(clid):
    # Utility function to translate CLIDs to the Label
    cell_ids = _get_cell_ids(current_app)
    for cell in cell_ids:
        if cell['CL_ID'] == clid:
            return cell['Label']


@cache
def translate_label(label):
    # Utility function to translate Labels to the CLID
    cell_ids = _get_cell_ids(current_app)
    for cell in cell_ids:
        if cell['Label'] == label or cell['Lookup_Label'] == label:
            return cell['CL_ID']


@cache
def _get_all_names_for_clid(clid):
    # Utility function to get all the unique cell names for a given CLID
    cell_ids = _get_all_labels()
    labels = [cell['Label'] for cell in cell_ids if cell['CL_ID'] == clid]
    # Deduplicate any exact matches and sort alphabetically
    return tuple(sorted(list(set(labels))))


@cache
@blueprint.route('/cells/total-datasets.json', methods=['GET'])
def total_datasets():
    # Get the total number of datasets in the HuBMAP API
    client = _get_client(current_app)
    datasets = client.select_datasets()
    # list() will call iterator behind the scenes.
    return {'results': len(list(datasets.get_list()))}
