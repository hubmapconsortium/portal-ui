import re
from glob import glob
from os.path import realpath, dirname

from flask import Blueprint, render_template, current_app
import mistune

from .config import types

blueprint = Blueprint('routes_markdown', __name__, template_folder='templates')

def title_from_md(md):
    return re.search(r'^#+\s+(\S.*)', md, re.MULTILINE)[1]

# glob(f'{dirname(__file__)}/markdown/**/*.md', recursive=True)


@blueprint.route('/fake')
def fake():
    with open(f'{dirname(__file__)}/markdown/fake.md') as md_file:
        content_md = md_file.read()
    title = title_from_md(content_md)
    content_html = mistune.markdown(content_md)

    return render_template('pages/markdown.html', types=types, title=title, content_html=content_html)
