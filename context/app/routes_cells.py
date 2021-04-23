from flask import (Blueprint, render_template)


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
    return {
        'message': 'TODO: Use the python client',
        'results': [{
            'what': 'nothing',
            'where': 'here'
        }]
    }
