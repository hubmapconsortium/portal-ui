import re
from glob import glob
from os.path import dirname

from flask import Blueprint, render_template, request, redirect

from .utils import get_default_flask_data, make_blueprint

# NOTE: A better approach might be to look again at the handful of libraries
# that handle this, or to pre-render everything when flask starts.

blueprint = make_blueprint(__name__)


def _title_from_md(md):
    '''
    >>> _title_from_md('## Subtitle first\\n#  REAL title\\n# Redundant')
    'REAL title'

    >>> _title_from_md('sorry')
    '(no title)'

    '''
    h1_matches = re.search(r'^#\s+(.*)', md, re.MULTILINE)
    return h1_matches[1].strip() if h1_matches else '(no title)'


def markdown_view():
    with open(dirname(__file__) + '/markdown/' + request.path + '.md') as md_file:
        content_md = md_file.read()
    title = _title_from_md(content_md)
    return render_template(
        'pages/base_react.html',
        flask_data={
            **get_default_flask_data(),
            'markdown': content_md
        },
        title=title
    )


def redirect_view():
    with open(dirname(__file__) + '/markdown/' + request.path + '.redirect') as redirect_file:
        target_url = redirect_file.read().strip()
    return redirect(target_url)


app_dir = dirname(__file__)
for (suffix, view_method) in [('.md', markdown_view), ('.redirect', redirect_view)]:
    for f in glob(app_dir + f'/markdown/**/*{suffix}', recursive=True):
        route = f.replace(app_dir + '/markdown', '').replace(suffix, '')
        blueprint.route(route)(view_method)
