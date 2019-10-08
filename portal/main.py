from flask import Blueprint, render_template, abort
from jinja2 import TemplateNotFound

blueprint = Blueprint('main', __name__, template_folder='templates')

@blueprint.route('/', defaults={'page': 'index'})
@blueprint.route('/<page>')
def show(page):
    try:
        return render_template('pages/%s.html' % page)
    except TemplateNotFound:
        abort(404)
