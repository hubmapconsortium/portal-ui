from flask import (render_template)

from .utils import get_default_flask_data, make_blueprint


blueprint = make_blueprint(__name__)


@blueprint.route('/workspaces')
def index():
    flask_data = {**get_default_flask_data()}
    return render_template(
        'base-pages/react-content.html',
        flask_data=flask_data,
        title='Workspaces'
    )


@blueprint.route('/workspaces/start/<workspace_id>')
def please_wait(workspace_id):
    flask_data = {**get_default_flask_data()}
    return render_template(
        'base-pages/react-content.html',
        flask_data=flask_data,
        title='Please Wait'
    )


@blueprint.route('/workspaces/<workspace_id>')
def workspace_detail(workspace_id):
    flask_data = {**get_default_flask_data()}
    return render_template(
        'base-pages/react-content.html',
        flask_data=flask_data,
        title='Workspace'
    )
