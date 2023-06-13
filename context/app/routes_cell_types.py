from itertools import islice, groupby
import time

from flask import render_template, current_app, request

from hubmap_api_py_client import Client
from hubmap_api_py_client.errors import ClientError

from .utils import get_default_flask_data, make_blueprint, get_organs

blueprint = make_blueprint(__name__)


@blueprint.route('/cell-types')
def cell_types_ui():
    organs = get_organs()
    return render_template(
        'base-pages/react-content.html',
        title='Cell Types',
        flask_data={**get_default_flask_data(), 'organs': organs}
    )
