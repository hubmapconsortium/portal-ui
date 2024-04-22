from itertools import islice, groupby
from posixpath import dirname
import time

from flask import render_template, current_app, request

from hubmap_api_py_client import Client
from hubmap_api_py_client.errors import ClientError

from .utils import get_default_flask_data, make_blueprint

from operator import itemgetter

from collections import defaultdict

from dataclasses import dataclass

from functools import cache

from csv import DictReader


blueprint = make_blueprint(__name__)


@blueprint.route('/cells')
def cells_ui():
    return render_template(
        'base-pages/react-content.html',
        title='Datasets: Molecular Data Queries',
        flask_data={**get_default_flask_data()}
    )


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


@timeit
@cache
def _get_cell_ids(app):
    client = _get_client(app)
    cell_label_ids = [cell["grouping_name"] for cell in client.select_celltypes().get_list()]
    with open(f'{dirname(__file__)}/all_labels.csv') as f:
        # Read in each row as a dictionary and store them in a list
        all_labels = DictReader(f, delimiter=',', fieldnames=[
                                'Organ_Level', 'A_L', 'A_ID', 'Label', 'CL_ID', 'CL_Match'])
        all_labels = list(all_labels)
        # Filter labels to only include the ones that are in the cell_label_ids
        all_labels = tuple([label for label in all_labels if label['CL_ID'] in cell_label_ids])

    return all_labels


@timeit
def _first_n_matches(strings, substring, n):
    '''
    >>> strings = [f'fake{n}' for n in range(200)]
    >>> first_n = _first_n_matches(strings, 'e1', 10)
    >>> first_n[0]
    {'full': 'fake1', 'pre': 'fak', 'match': 'e1', 'post': ''}
    >>> first_n[-1]
    {'full': 'fake18', 'pre': 'fak', 'match': 'e1', 'post': '8'}
    '''
    substring_lower = substring.lower()
    first_n = list(islice((s for s in strings if substring_lower in s.lower()), n))
    offsets = [s.lower().find(substring_lower) for s in first_n]
    return [{
        'full': s,
        'pre': s[:offset],
        'match': s[offset:offset + len(substring)],
        'post': s[offset + len(substring):]
    } for s, offset in zip(first_n, offsets)]


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
        grp_list = list(grp)
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
    return {'results': _first_n_matches(_get_gene_symbols(current_app), substring, 10)}


@timeit
@blueprint.route('/cells/proteins-by-substring.json', methods=['POST'])
def proteins_by_substring():
    substring = request.args.get('substring')
    return {'results': _first_n_matches(_get_protein_ids(current_app), substring, 10)}


@timeit
@blueprint.route('/cells/cell-types-by-substring.json', methods=['POST'])
def cell_types_by_substring():
    substring = request.args.get('substring')
    cell_types = _get_cell_ids(current_app)
    results = []
    # Enable lookups by CLID or Label name
    if substring.startswith('CL:'):
        # Do initial lookup by CLID
        clids = [result['full'] for result in _first_n_matches(
            [cell['CL_ID'] for cell in cell_types], substring, 10)]
        # Match the found CLIDs with their corresponding labels
        labels = [translate_clid(clid) for clid in clids]
        # Format results as expected by the frontend
        results = [{'full': l, 'pre': l, 'match': '', 'post': ''} for l in labels]
    else:
        results = _first_n_matches([cell['Label'] for cell in cell_types], substring, 10)
    return {'results': results}


@timeit
@blueprint.route('/cells/datasets-selected-by-<target_entity>.json', methods=['POST'])
def datasets_selected_by_level(target_entity):
    cell_variable_names = request.args.getlist('cell_variable_name')
    modality = request.args.get('modality')
    min_expression = request.args.get('min_expression')
    min_cell_percentage = request.args.get('min_cell_percentage')

    client = _get_client(current_app)

    try:
        dataset_set = client.select_datasets(
            where=target_entity,
            has=[f'{name} > {min_expression}'
                 for name in cell_variable_names],
            genomic_modality=modality,
            min_cell_percentage=min_cell_percentage
        )
    except ClientError as e:
        # TODO: We want to distinguish the expected errors
        # (like 4xx: "ABALON not present in rna index")
        # from unexpected errors (like any 5xx).
        # That needs to be done upstream in the API Client,
        # but for now, we want to turn something around quickly.
        # In the long run, we don't want to expose internal error messages in the UI.
        # https://github.com/hubmapconsortium/hubmap-api-py-client/issues/75
        return {'message': str(e)}
    return {'results': list(dataset_set.get_list())}


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
    return {'results': list(cells.get_list(values_included=cell_variable_names))}


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


@cache
def translate_clid(clid):
    cell_labels = _get_cell_ids(current_app)
    for cell in cell_labels:
        if cell['CL_ID'] == clid:
            return cell['Label']
    raise KeyError(f'CLID {clid} not found in cell_labels')
