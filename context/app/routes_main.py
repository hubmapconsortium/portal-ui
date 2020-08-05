from os.path import dirname

from flask import (Blueprint, render_template, abort, current_app,
                   session, request, redirect, url_for)

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


@blueprint.route('/browse/collection/<uuid>')
def collection_details(uuid):
    client = _get_client()
    collection = client.get_collection(uuid)
    core_props = {'endpoints': _get_endpoints(), 'collection': collection}
    template = f'pages/base_react.html'
    return render_template(
        template,
        uuid=uuid,
        title=f'{collection["display_doi"]} | Collection',
        flask_data=core_props
    )


@blueprint.route('/browse/collection/<uuid>.<ext>')
def collection_details_ext(uuid, ext):
    if ext != 'json':
        abort(404)
    client = _get_client()

    collection = client.get_collection(uuid)
    return collection


@blueprint.route('/browse/<type>/<uuid>')
def details(type, uuid):
    if type not in types:
        abort(404)
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
    return render_template(
        'pages/base_react.html',
        title=title,
        types=types,
        flask_data=core_props
    )


@blueprint.route('/dev-search')
def dev_search():
    title = 'Dev Search'
    core_props = {
        'endpoints': _get_endpoints(),
        'title': title
    }
    return render_template(
        'pages/base_react.html',
        title=title,
        types=types,
        flask_data=core_props
    )


@blueprint.route('/preview/<name>')
def preview_view(name):
    filename = dirname(__file__) + '/preview/' + name + '.md'
    metadata_content = frontmatter.load(filename)
    preview_metadata = metadata_content.metadata
    markdown = metadata_content.content
    core_props = {
        'title': preview_metadata['title'],
        'markdown': markdown,
        'entity': {
            'group_name': preview_metadata['group_name'],
            'created_by_user_displayname': preview_metadata['created_by_user_displayname'],
            'created_by_user_email': preview_metadata['created_by_user_email'],
        },
    }
    if 'vitessce_conf' in preview_metadata:
        core_props['vitessce_conf'] = preview_metadata['vitessce_conf']
    return render_template(
        'pages/base_react.html',
        title='Preview',
        flask_data=core_props
    )


@blueprint.route('/collections')
def collections():
    core_props = {
        'endpoints': _get_endpoints(),
    }
    return render_template(
        'pages/base_react.html',
        title='Collections',
        flask_data=core_props
    )
