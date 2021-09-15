from itertools import islice, groupby

from flask import render_template, current_app, request

from hubmap_api_py_client import Client

from .utils import get_default_flask_data, make_blueprint

from operator import itemgetter

from collections import defaultdict

from dataclasses import dataclass

blueprint = make_blueprint(__name__)


@blueprint.route('/cells')
def cells_ui():
    return render_template(
        'pages/base_react.html',
        title='Cells API Demo',
        flask_data={**get_default_flask_data()}
    )


def _get_client(app):
    return Client(app.config['XMODALITY_ENDPOINT'] + '/api/')


# TODO: In python 3.9, functools.cache would be better.
gene_symbols = None


def _get_gene_symbols(app):
    client = _get_client(app)
    global gene_symbols
    if gene_symbols is None:
        gene_symbols = [gene["gene_symbol"] for gene in client.select_genes().get_list()]
    return gene_symbols


protein_ids = None


def _get_protein_ids(app):
    client = _get_client(app)
    global protein_ids
    if protein_ids is None:
        protein_ids = [protein["protein_id"] for protein in client.select_proteins().get_list()]
    return protein_ids


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


def _get_cluster_cells(cells, query_type, name, min_expression):
    '''
    >>> cells = _get_cluster_cells([
    ...         {
    ...             "clusters": [
    ...                 "cluster-method-a-1",
    ...                 "cluster-method-b-1"
    ...             ],
    ...             "modality": "Z",
    ...             "values": {
    ...                 "VIM": 21.0
    ...             }
    ...         },
    ...                 {
    ...             "clusters": [
    ...                 "cluster-method-a-1",
    ...                 "cluster-method-b-2"
    ...             ],
    ...             "modality": "Z",
    ...             "values": {
    ...                 "VIM": 12.0
    ...             }
    ...         },
    ...         {
    ...             "clusters": [
    ...                 "cluster-method-a-1",
    ...                 "cluster-method-b-1"
    ...             ],
    ...             "modality": "Z",
    ...             "values": {
    ...                 "VIM": 7.0
    ...             }
    ...         }], 'gene', 'VIM', 10)
    >>> import pprint
    >>> pprint.pprint(cells)
    [{'cluster_name': 'cluster-method-a',
      'cluster_number': '1',
      'meets_minimum_expression': True,
      'modality': 'Z'},
     {'cluster_name': 'cluster-method-b',
      'cluster_number': '1',
      'meets_minimum_expression': True,
      'modality': 'Z'},
     {'cluster_name': 'cluster-method-a',
      'cluster_number': '1',
      'meets_minimum_expression': True,
      'modality': 'Z'},
     {'cluster_name': 'cluster-method-b',
      'cluster_number': '2',
      'meets_minimum_expression': True,
      'modality': 'Z'},
     {'cluster_name': 'cluster-method-a',
      'cluster_number': '1',
      'meets_minimum_expression': False,
      'modality': 'Z'},
     {'cluster_name': 'cluster-method-b',
      'cluster_number': '1',
      'meets_minimum_expression': False,
      'modality': 'Z'}]
    '''
    cluster_cells = []
    for cell in cells:
        for cluster in cell['clusters']:
            cluster_name, cluster_number = _get_cluster_name_and_number(cluster)
            cluster_cell = {'cluster_name': cluster_name,
                            'cluster_number': cluster_number,
                            'meets_minimum_expression':
                            cell['values'][name] >= min_expression}
            if query_type == 'gene':
                cluster_cell['modality'] = cell['modality']
            cluster_cells.append(cluster_cell)
    return cluster_cells


def _get_matched_cell_counts_per_cluster(cells, query_type):
    '''
    >>> clusters = _get_matched_cell_counts_per_cluster([
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
    ...     ], 'gene')
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
    group_keys = ["cluster_name", "cluster_number"]
    if query_type == 'gene':
        group_keys.append('modality')
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


@blueprint.route('/cells/genes-by-substring.json', methods=['POST'])
def genes_by_substring():
    substring = request.args.get('substring')
    return {'results': _first_n_matches(_get_gene_symbols(current_app), substring, 10)}


@blueprint.route('/cells/proteins-by-substring.json', methods=['POST'])
def proteins_by_substring():
    substring = request.args.get('substring')
    return {'results': _first_n_matches(_get_protein_ids(current_app), substring, 10)}


@blueprint.route('/cells/datasets-selected-by-<target_entity>.json', methods=['POST'])
def datasets_selected_by_level(target_entity):
    names = request.args.getlist('name')
    modality = request.args.get('modality')
    min_expression = request.args.get('min_expression')
    min_cell_percentage = request.args.get('min_cell_percentage')

    client = _get_client(current_app)

    try:
        dataset_set = client.select_datasets(
            where=target_entity,
            has=[f'{name} > {min_expression}' for name in names],
            genomic_modality=modality,
            min_cell_percentage=min_cell_percentage
        )
        return {'results': list(dataset_set.get_list())}

    except Exception as e:
        return {'message': str(e)}


@blueprint.route('/cells/cell-percentages-for-datasets.json', methods=['POST'])
def cell_percentages_for_datasets():
    # Select a set of datasets where cells express a given gene,
    # and for each dataset, give the percentage of matching cells.

    uuids = request.args.getlist('uuid')
    gene_name = request.args.get('gene_name')
    min_gene_expression = request.args.get('min_gene_expression')

    client = _get_client(current_app)

    try:
        dataset_set = client.select_datasets(where='dataset', has=[uuids])
        results = list(dataset_set.get_list(
            values_included=[f'{gene_name} > {min_gene_expression}'])
        )

        return {'results': results}

    except Exception as e:
        return {'message': str(e)}


@blueprint.route('/cells/cell-expression-in-dataset.json', methods=['POST'])
def cell_expression_in_dataset():
    # For a single dataset we want to get the expression level of a given gene for all cells.
    # (In our discussion, we started by thinking about the set of matching cells,
    # and then showing expression levels for the two groups, but that’s not needed.)

    uuid = request.args.get('uuid')
    names = request.args.getlist('names')

    client = _get_client(current_app)

    try:
        cells = client.select_cells(where='dataset', has=[uuid])
        # list() will call iterator behind the scenes.
        return {'results': list(cells.get_list(values_included=names))}

    except Exception as e:
        return {'message': str(e)}


@blueprint.route('/cells/all-indexed-uuids.json', methods=['POST'])
def all_indexed_uuids():
    # Get all UUIDs that have been indexed. Because of the delay in indexing,
    # we can't assume that all datasets of any particular type have been indexed.

    client = _get_client(current_app)

    try:
        datasets = client.select_datasets()
        # list() will call iterator behind the scenes.
        return {'results': list(datasets.get_list())}

    except Exception as e:
        return {'message': str(e)}


@blueprint.route('/cells/cells-in-dataset-clusters.json', methods=['POST'])
def cells_in_dataset_clusters():
    # For a single dataset we want to get the expression level of a given gene for all cells.
    # (In our discussion, we started by thinking about the set of matching cells,
    # and then showing expression levels for the two groups, but that’s not needed.)

    uuid = request.args.get('uuid')
    name = request.args.get('name')
    query_type = request.args.get('query_type')
    min_expression = request.args.get('min_expression')
    client = _get_client(current_app)

    try:
        cells = client.select_cells(where='dataset', has=[uuid])
        cells_list = cells.get_list(values_included=name)

        return {'results':
                _get_matched_cell_counts_per_cluster(
                    _get_cluster_cells(cells_list, query_type, name, float(min_expression)), query_type)}

    except Exception as e:
        return {'message': str(e)}
