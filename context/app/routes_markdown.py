import re
from glob import glob
from os.path import dirname

from flask import Blueprint, render_template, request
import mistune

from .config import types

blueprint = Blueprint('routes_markdown', __name__, template_folder='templates')


def _title_from_md(md):
    return re.search(r'^#+\s(.*)', md, re.MULTILINE)[1].strip()


def markdown_view():
    with open(dirname(__file__) + '/markdown/' + request.path + '.md') as md_file:
        content_md = md_file.read()
    title = _title_from_md(content_md)
    content_html = mistune.markdown(content_md)
    return render_template(
        'pages/markdown.html',
        types=types,
        title=title,
        content_html=content_html
    )


app_dir = dirname(__file__)
for f in glob(app_dir + '/**/*.md', recursive=True):
    route = f.replace(app_dir + '/markdown', '').replace('.md', '')
    markdown_route = blueprint.route(route)(markdown_view)
