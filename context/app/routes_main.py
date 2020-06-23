from os.path import dirname

from flask import (Blueprint, render_template, abort, current_app,
                   session, request, redirect, url_for)

import markdown
import frontmatter

from .api.client import ApiClient
from .config import types


blueprint = Blueprint('routes', __name__, template_folder='templates')


def _get_client():
    try:
        is_mock = current_app.config['IS_MOCK']
    except KeyError:
        is_mock = False
    if is_mock:
        return ApiClient(is_mock=is_mock)
    if 'nexus_token' not in session:
        abort(403)
    return ApiClient(
        current_app.config['ENTITY_API_BASE'],
        session['nexus_token']
    )


def _get_endpoints():
    return {
        'elasticsearchEndpoint': current_app.config['ELASTICSEARCH_ENDPOINT']
        + current_app.config['PORTAL_INDEX_PATH'],
        'assetsEndpoint': current_app.config['ASSETS_ENDPOINT'],
        'entityEndpoint': current_app.config['ENTITY_API_BASE']
    }


@blueprint.route('/')
def index():
    core_props = {'endpoints': _get_endpoints()}
    return render_template(
        'pages/base_react.html',
        types=types,
        flask_data=core_props,
        title='Welcome'
    )


@blueprint.route('/ccf-eui')
def ccf_eui():
    return render_template(
        'pages/ccf-eui.html',
        config=current_app.config,
        url_root=request.url_root,
        nexus_token=(
            session['nexus_token']
            if 'nexus_token' in session
            else ''
        )
    )


@blueprint.route('/browse/<type>/<uuid>')
def details(type, uuid):
    if type not in types:
        abort(404)
    if 'nexus_token' not in session:
        abort(403)
    client = _get_client()
    entity = client.get_entity(uuid)
    actual_type = entity['entity_type'].lower()
    if type != actual_type:
        return redirect(url_for('routes.details', type=actual_type, uuid=uuid))

    template = f'pages/base_react.html'
    core_props = {'endpoints': _get_endpoints()}
    core_props.update({
        'entity': entity,
        'vitessce_conf': client.get_vitessce_conf(entity)
    })
    return render_template(
        template,
        type=type,
        uuid=uuid,
        title=f'{entity["display_doi"]} | {type.title()}',
        flask_data=core_props
    )


@blueprint.route('/browse/<type>/<uuid>.<ext>')
def details_ext(type, uuid, ext):
    if type not in types:
        abort(404)
    if ext != 'json':
        abort(404)
    if 'nexus_token' not in session:
        abort(403)
    client = _get_client()

    entity = client.get_entity(uuid)
    return entity


@blueprint.route('/search')
def search():
    entity_type = request.args.get('entity_type[0]')
    title = f'{entity_type}s' if entity_type else 'Search'
    core_props = {
        'endpoints': _get_endpoints(),
        'title': title
    }
    if 'nexus_token' not in session:
        abort(403)
    return render_template(
        'pages/base_react.html',
        title=title,
        types=types,
        flask_data=core_props
    )


@blueprint.route('/showcase/<name>')
def showcase_view(name):
    filename = dirname(__file__) + '/showcase/' + name + '.md'
    showcase_metadata = frontmatter.load(filename).metadata
    content_md = frontmatter.load(filename).content
    core_props = {
        'title': showcase_metadata['title'],
        'vitessce_conf': showcase_metadata['vitessce_conf'],
        'entity': {
            'description_html': markdown.markdown(content_md),
            'group_name': showcase_metadata['group_name'],
            'created_by_user_displayname': showcase_metadata['created_by_user_displayname'],
            'created_by_user_email': showcase_metadata['created_by_user_email'],
        },
    }
    return render_template(
        'pages/base_react.html',
        title='Showcase',
        flask_data=core_props
    )
