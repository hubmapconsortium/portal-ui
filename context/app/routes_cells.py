from itertools import islice

from flask import (Blueprint, render_template, current_app, request)

from hubmap_api_py_client import Client


blueprint = Blueprint('routes_cells', __name__, template_folder='templates')


@blueprint.route('/cells')
def cells_ui():
    return render_template(
        'pages/base_react.html',
        title='Cells API Demo',
        flask_data={}
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
    substring_lower = substring.lower()
    # TODO: Python 3.8 allows assignment within comprehensions.
    first_n = list(islice((s for s in strings if substring_lower in s.lower()), n))
    offsets = [s.lower().find(substring_lower) for s in first_n]
    return [{
        'full': s,
        'pre': s[:offset],
        'match': s[offset:offset + len(substring)],
        'post': s[offset + len(substring):]
    } for s, offset in zip(first_n, offsets)]


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
    name = request.args.get('name')
    modality = request.args.get('modality')
    min_expression = request.args.get('min_expression')
    min_cell_percentage = request.args.get('min_cell_percentage')

    client = _get_client(current_app)

    try:
        dataset_set = client.select_datasets(
            where=target_entity,
            has=[f'{name} > {min_expression}'],
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
    gene_names = request.args.getlist('gene_name')

    client = _get_client(current_app)

    try:
        cells = client.select_cells(where='dataset', has=[uuid])
        # list() will call iterator behind the scenes.
        return {'results': list(cells.get_list(values_included=gene_names))}

    except Exception as e:
        return {'message': str(e)}
