from flask import current_app, render_template

from .routes_scfind import peek_cell_type_name

from .utils import make_blueprint, get_default_flask_data


blueprint = make_blueprint(__name__)


@blueprint.route('/cell-types')
def cell_types_view():
    return render_template(
        'base-pages/react-content.html', title='Cell Types', flask_data=get_default_flask_data()
    )


@blueprint.route('/cell-types/<cl_id>')
def cell_types_detail_view(cl_id):
    # Seed the cell type name from the warmed CLID->label map so the page title renders immediately,
    # rather than waiting on the page's async scfind aggregate fetch. Best-effort: a cache miss (or
    # any error) yields no name and the page falls back to the aggregate; it never blocks rendering.
    try:
        cell_type_name = peek_cell_type_name(cl_id)
    except Exception as e:
        current_app.logger.warning(f'Failed to resolve cell type name for {cl_id}: {e}')
        cell_type_name = ''
    return render_template(
        'base-pages/react-content.html',
        title='Cell Type Details',
        flask_data={
            **get_default_flask_data(),
            'cell_type': cl_id,
            'cell_type_name': cell_type_name,
        },
    )


@blueprint.route('/genes/<gene_symbol>')
def genes_detail_view(gene_symbol):
    flask_data = {**get_default_flask_data(), 'geneSymbol': gene_symbol}
    return render_template(
        'base-pages/react-content.html', title=gene_symbol, flask_data=flask_data
    )
