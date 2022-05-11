from flask import (render_template)

from .utils import get_default_flask_data, make_blueprint


blueprint = make_blueprint(__name__)


@blueprint.route('/workspaces')
def index():
    flask_data = {**get_default_flask_data()}
    return render_template(
        'pages/base_react.html',
        flask_data=flask_data,
        title='Workspaces'
    )
