from flask import Blueprint, render_template, abort
from jinja2 import TemplateNotFound

blueprint = Blueprint('main', __name__, template_folder='templates')


@blueprint.route('/')
def index():
    return render_template('pages/index.html')


@blueprint.route('/browse/<type>')
def browse(type):
    return render_template('pages/browse.html', type=type)


@blueprint.route('/browse/<type>/<id>')
def details(type, id):
    return render_template('pages/details.html', type=type, id=id)


@blueprint.route('/help')
def help():
    return render_template('pages/help.html')
