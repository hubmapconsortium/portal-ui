from flask import Blueprint, render_template
import mistune

from .config import types

blueprint = Blueprint('routes_markdown', __name__, template_folder='templates')


@blueprint.route('/fake')
def fake():
    content_md = '*Content!*'
    content_html = mistune.markdown(content_md)

    return render_template('pages/markdown.html', types=types, title='title!!!', content_html=content_html)
