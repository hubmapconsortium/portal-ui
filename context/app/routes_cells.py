import requests as http_requests
from flask import render_template, current_app, request, redirect, url_for

from .utils import (
    EXTERNAL_REQUEST_TIMEOUT,
    get_default_flask_data,
    make_blueprint,
)

from functools import cache


blueprint = make_blueprint(__name__)


@blueprint.route('/search/biomarkers-cell-types')
def cells_ui():
    return render_template(
        'base-pages/react-content.html',
        title='Biomarker and Cell Type Search',
        flask_data={**get_default_flask_data()},
    )


@blueprint.route('/cells')
def cells_redirect():
    return redirect(url_for('routes_cells.cells_ui'), code=301)


@blueprint.route('/biomarkers')
def biomarkers_ui():
    return render_template(
        'base-pages/react-content.html',
        title='Biomarkers',
        flask_data={**get_default_flask_data()},
    )


@cache
def _get_scfind_gene_sets():
    from . import routes_scfind

    rna_genes = set(routes_scfind._get_all_genes())
    atac_genes = set(routes_scfind._get_all_genes('ATAC'))
    return rna_genes, atac_genes


@blueprint.route('/biomarkers/genes-info.json')
def biomarkers_genes_info():
    """
    Proxy the UBKG /genes-info endpoint and enrich each gene with scFind modality availability.

    Query params (forwarded to UBKG):
        genes_per_page, starts_with, page

    Returns the UBKG response with additional fields per gene:
        has_scfind_rna (bool|null), has_scfind_atac (bool|null)
    """
    ubkg_endpoint = current_app.config['UBKG_ENDPOINT']
    params = {k: v for k, v in request.args.items()}

    try:
        ubkg_response = http_requests.get(
            f'{ubkg_endpoint}/genes-info',
            params=params,
            timeout=EXTERNAL_REQUEST_TIMEOUT,
        )
        ubkg_response.raise_for_status()
        data = ubkg_response.json()
    except http_requests.exceptions.Timeout:
        current_app.logger.error('Timeout fetching genes-info from UBKG')
        return {'error': 'UBKG request timed out'}, 504
    except http_requests.RequestException as e:
        current_app.logger.error(f'Error proxying UBKG genes-info: {e}')
        return {'error': 'Failed to fetch gene information'}, 502

    genes = data.get('genes', [])
    try:
        rna_genes, atac_genes = _get_scfind_gene_sets()
        for gene in genes:
            symbol = gene.get('approved_symbol', '')
            gene['has_scfind_rna'] = symbol in rna_genes
            gene['has_scfind_atac'] = symbol in atac_genes
    except Exception as e:
        current_app.logger.warning(f'Failed to load scFind gene sets: {e}')
        for gene in genes:
            gene['has_scfind_rna'] = None
            gene['has_scfind_atac'] = None
        return data

    # Per-gene dataset counts for the Data Type chips. Best-effort: a failure here leaves the
    # availability flags intact and just reports 0 counts.
    try:
        from . import routes_scfind

        rna_symbols = [g['approved_symbol'] for g in genes if g.get('has_scfind_rna')]
        atac_symbols = [g['approved_symbol'] for g in genes if g.get('has_scfind_atac')]
        rna_counts = routes_scfind._dataset_counts_for_genes(rna_symbols)
        atac_counts = routes_scfind._dataset_counts_for_genes(atac_symbols, modality='ATAC')
    except Exception as e:
        current_app.logger.warning(f'Failed to load scFind dataset counts: {e}')
        rna_counts, atac_counts = {}, {}

    for gene in genes:
        symbol = gene.get('approved_symbol', '')
        gene['scfind_rna_dataset_count'] = rna_counts.get(symbol, 0)
        gene['scfind_atac_dataset_count'] = atac_counts.get(symbol, 0)

    return data
