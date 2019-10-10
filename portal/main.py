from flask import Blueprint, render_template, abort

from .api.client import ApiClient


blueprint = Blueprint('main', __name__, template_folder='templates')

types = ['donor', 'sample', 'dataset']


@blueprint.route('/')
def home():
    return render_template('pages/index.html')


@blueprint.route('/browse/<type>')
def browse(type):
    if type not in types:
        abort(404)
    return render_template('pages/browse.html', type=type)


@blueprint.route('/browse/<type>/<id>')
def details(type, id):
    if type not in types:
        abort(404)
    client = ApiClient('TODO: base url from config')
    details = client.get_entity(id)
    return render_template('pages/details.html', type=type, id=id, details=details)


@blueprint.route('/help')
def help():
    return render_template('pages/help.html')
