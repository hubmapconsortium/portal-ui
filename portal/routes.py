from flask import Blueprint, render_template, abort

from .api.client import ApiClient
from .render import object_as_html


blueprint = Blueprint('routes', __name__, template_folder='templates')

types = [
    ('donor', 'Donors'),
    ('sample', 'Samples'),
    ('dataset', 'Datasets'),
    ('file', 'Files')
]


@blueprint.route('/')
def home():
    return render_template('pages/index.html', types=types)


@blueprint.route('/browse/<type>')
def browse(type):
    if type not in types:
        abort(404)
    client = ApiClient('TODO: base url from config')
    entities = client.get_entities(type)
    return render_template('pages/browse.html', type=type, entities=entities)


@blueprint.route('/browse/<type>/<uuid>')
def details(type, uuid):
    if type not in types:
        abort(404)
    client = ApiClient('TODO: base url from config')
    details = client.get_entity(uuid)
    details_html = object_as_html(details)
    return render_template('pages/details.html', type=type, uuid=uuid, details_html=details_html)


@blueprint.route('/help')
def help():
    return render_template('pages/help.html')
