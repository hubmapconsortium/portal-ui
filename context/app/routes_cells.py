from flask import (Blueprint, render_template, current_app)

from hubmap_api_py_client import Client


blueprint = Blueprint('routes_cells', __name__, template_folder='templates')


@blueprint.route('/cells')
def cells_ui():
    return render_template(
        'pages/base_react.html',
        title='Cells API Demo',
        flask_data={}
    )


@blueprint.route('/cells.json', methods=['POST'])
def cells_api():
    client = Client(current_app.config['CELLS_API_ENDPOINT'])
    datasets = client.select_datasets().get_list()[0:10]
    return {
        'message': 'TODO: Do something useful',
        'results': datasets
    }
