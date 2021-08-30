from os.path import dirname
from pathlib import Path

from yaml import safe_load
from flask import (render_template)

import frontmatter

from .utils import get_default_flask_data, make_blueprint


blueprint = make_blueprint(__name__)


@blueprint.route('/preview/<name>')
def preview_details_view(name):
    filename = dirname(__file__) + '/preview/' + name + '.md'
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
        'pages/base_react.html',
        title='Preview',
        flask_data=flask_data
    )


@blueprint.route('/publication')
def publication_index_view():
    dir_path = Path(dirname(__file__) + '/publication')
    publications = {p.stem: dict(frontmatter.load(p)) for p in dir_path.glob('*.md')}
    flask_data = {
        **get_default_flask_data(),
        'publications': publications
    }
    return render_template(
        'pages/base_react.html',
        title='Publications',
        flask_data=flask_data
    )


@blueprint.route('/publication/<name>')
def publication_details_view(name):
    filename = dirname(__file__) + '/publication/' + name + '.md'
    metadata_content = frontmatter.load(filename)
    publication_metadata = metadata_content.metadata
    markdown = metadata_content.content
    flask_data = {
        **get_default_flask_data(),
        'title': publication_metadata['title'],
        'markdown': markdown,
        # Unlike preview, no "entity".
        'vitessce_conf': publication_metadata.get('vitessce_conf')
    }
    return render_template(
        'pages/base_react.html',
        title='Publication',
        flask_data=flask_data
    )


@blueprint.route('/organ')
def organ_index_view():
    dir_path = Path(dirname(__file__) + '/organ')
    organs = {p.stem: safe_load(p.read_text()) for p in dir_path.glob('*.yaml')}
    flask_data = {
        **get_default_flask_data(),
        'organs': organs
    }
    return render_template(
        'pages/base_react.html',
        title='Organs',
        flask_data=flask_data
    )


@blueprint.route('/organ/<name>')
def organ_details_view(name):
    filename = Path(dirname(__file__)) / 'organ' / f'{name}.yaml'
    organ = safe_load(filename.read_text)
    flask_data = {
        **get_default_flask_data(),
        'organ': organ
    }
    return render_template(
        'pages/base_react.html',
        title='Organ',
        flask_data=flask_data
    )
