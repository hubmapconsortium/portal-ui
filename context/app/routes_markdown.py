import re

from flask import Blueprint, render_template
import mistune

from .config import types

blueprint = Blueprint('routes_markdown', __name__, template_folder='templates')

def title_from_md(md):
    return re.search(r'^#+\s+(\S.*)', md, re.MULTILINE)[1]

@blueprint.route('/fake')
def fake():
    content_md = '# Howdy!\n*Content!*'
    title = title_from_md(content_md)
    content_html = mistune.markdown(content_md)

    return render_template('pages/markdown.html', types=types, title=title, content_html=content_html)
