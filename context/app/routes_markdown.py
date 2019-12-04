from flask import Blueprint, render_template

from .config import types

blueprint = Blueprint('routes_markdown', __name__, template_folder='templates')


@blueprint.route('/fake')
def fake():
    return render_template('pages/markdown.html', types=types, title='title!!!', content_html='<i>Content!</i>')
