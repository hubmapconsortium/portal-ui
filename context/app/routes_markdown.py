import re
from glob import glob
from os.path import dirname

from flask import render_template, request, redirect
from werkzeug.utils import secure_filename

from .utils import get_default_flask_data, make_blueprint

# NOTE: A better approach might be to look again at the handful of libraries
# that handle this, or to pre-render everything when flask starts.

blueprint = make_blueprint(__name__)


def _secure_path(unsafe_path):
    """
    >>> _secure_path('../../sneaky path.txt')
    '//sneaky_path.txt'

    >>> _secure_path('a/b/c/one_safe-path.txt')
    'a/b/c/one_safe-path.txt'
    """
    # TODO: When we don't need to host docs, get rid of this.
    return '/'.join(secure_filename(name) for name in unsafe_path.split('/'))


def _title_from_md(md):
    """
    >>> _title_from_md('## Subtitle first\\n#  REAL title\\n# Redundant')
    'REAL title'

    >>> _title_from_md('sorry')
    '(no title)'

    """
    h1_matches = re.search(r'^#\s+(.*)', md, re.MULTILINE)
    return h1_matches[1].strip() if h1_matches else '(no title)'


def markdown_view():
    filename = f'{dirname(__file__)}/markdown/{_secure_path(request.path)}.md'
    with open(filename) as md_file:
        content_md = md_file.read()
    title = _title_from_md(content_md)
    return render_template(
        'base-pages/react-content.html',
        flask_data={**get_default_flask_data(), 'markdown': content_md},
        title=title,
    )


def redirect_view():
    filename = f'{dirname(__file__)}/markdown/{_secure_path(request.path)}.redirect'
    with open(filename) as redirect_file:
        target_url = redirect_file.read().strip()
    return redirect(target_url)


app_dir = dirname(__file__)
for suffix, view_method in [('.md', markdown_view), ('.redirect', redirect_view)]:
    for f in glob(app_dir + f'/markdown/**/*{suffix}', recursive=True):
        route = f.replace(app_dir + '/markdown', '').replace(suffix, '')
        blueprint.route(route)(view_method)
