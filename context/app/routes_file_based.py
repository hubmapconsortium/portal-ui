from os.path import dirname
from pathlib import Path

from yaml import safe_load
from flask import render_template, redirect, url_for, request
from werkzeug.utils import secure_filename

import frontmatter

from .utils import get_default_flask_data, make_blueprint, get_organs


blueprint = make_blueprint(__name__)


@blueprint.route('/preview/<name>')
def preview_details_view(name):
    filename = dirname(__file__) + '/preview/' + secure_filename(name) + '.md'
    metadata_content = frontmatter.load(filename)
    preview_metadata = metadata_content.metadata
    markdown = metadata_content.content
    flask_data = {
        **get_default_flask_data(),
        'title': preview_metadata['title'],
        'markdown': markdown,
        'entity': {
            'group_name': preview_metadata['group_name'],
            'created_by_user_displayname': preview_metadata['created_by_user_displayname'],
            'created_by_user_email': preview_metadata['created_by_user_email'],
        },
        'vitessce_conf': preview_metadata.get('vitessce_conf')
    }
    return render_template(
        'base-pages/react-content.html',
        title='Preview',
        flask_data=flask_data
    )


@blueprint.route('/organ')
def organ_index_view():
    organs = get_organs()
    redirected_from = request.args.get('redirected_from') or None
    flask_data = {
        **get_default_flask_data(),
        'organs': organs,
        'redirected_from': redirected_from
    }
    return render_template(
        'base-pages/react-content.html',
        title='Organs',
        flask_data=flask_data
    )


def redirect_to_organ_from_search(name, organs):
    for k, v in organs.items():
        if name in v.get('search'):
            return redirect(url_for('routes_file_based.organ_details_view', name=k))
    # If organ is not found, redirect to the organ index page with a message.
    return redirect(url_for('routes_file_based.organ_index_view', redirected_from=name), code=308)


@blueprint.route('/organ/<name>')
def organ_details_view(name):
    organ = get_organ_details(name)
    if (organ.keys().__len__() == 0):
        return redirect_to_organ_from_search(name, get_organs())
    flask_data = {
        **get_default_flask_data(),
        'organ': organ
    }
    return render_template(
        'base-pages/react-content.html',
        title=organ['name'],
        flask_data=flask_data
    )


@blueprint.route('/organ/<name>.json')
def get_organ_details(name):
    organs = get_organs()
    normalized_name = name.lower().strip().replace(' ', '-').replace('_', '-')
    if normalized_name not in organs:
        return {}
    filename = Path(dirname(__file__)) / 'organ' / f'{secure_filename(normalized_name)}.yaml'
    organ = safe_load(filename.read_text())
    return organ


@blueprint.route('/organs.json', methods=['POST'])
def get_organ_list():
    organs_to_get = request.json.get('organs')
    organs = {}
    for organ in organs_to_get:
        org = get_organ_details(organ)
        if (org.keys().__len__() > 0):
            organs[organ] = org
    return organs
