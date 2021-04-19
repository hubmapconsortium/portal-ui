from os.path import dirname
from urllib.parse import urlparse
import json

from flask import (Blueprint, render_template, abort, current_app,
                   session, request, redirect, url_for, Response)

import frontmatter

from .api.client import ApiClient


entity_types = ['donor', 'sample', 'dataset', 'collection']
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
    flask_data = {'endpoints': _get_endpoints()}
    return render_template(
        'pages/base_react.html',
        types=entity_types,
        flask_data=flask_data,
        title='HuBMAP Data Portal',
        is_home_page=True
    )


@blueprint.route('/home-revision')
def home_revision():
    flask_data = {'endpoints': _get_endpoints()}
    return render_template(
        'pages/base_react.html',
        types=entity_types,
        flask_data=flask_data,
        title='HuBMAP Data Portal',
        is_home_page=True
    )


@blueprint.route('/services')
def service_status():
    flask_data = {'endpoints': _get_endpoints()}
    return render_template(
        'pages/base_react.html',
        types=entity_types,
        flask_data=flask_data,
        title='Services'
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


@blueprint.route('/browse/HBM<hbm_suffix>')
def hbm_redirect(hbm_suffix):
    client = _get_client()
    entity = client.get_entity(hbm_id=f'HBM{hbm_suffix}')
    return redirect(
        url_for('routes.details', type=entity['entity_type'].lower(), uuid=entity['uuid']))


@blueprint.route('/browse/<type>/<uuid>')
def details(type, uuid):
    if type not in entity_types:
        abort(404)
    client = _get_client()
    entity = client.get_entity(uuid)
    actual_type = entity['entity_type'].lower()
    if type != actual_type:
        return redirect(url_for('routes.details', type=actual_type, uuid=uuid))

    template = f'pages/base_react.html'
    flask_data = {
        'endpoints': _get_endpoints(),
        'entity': entity,
        'vitessce_conf': client.get_vitessce_conf(entity)
    }
    return render_template(
        template,
        type=type,
        uuid=uuid,
        title=f'{entity["display_doi"]} | {type.title()}',
        flask_data=flask_data
    )


@blueprint.route('/browse/<type>/<uuid>.<ext>')
def details_ext(type, uuid, ext):
    if type not in entity_types:
        abort(404)
    if ext != 'json':
        abort(404)
    client = _get_client()
    entity = client.get_entity(uuid)
    return entity


@blueprint.route('/browse/<type>/<uuid>.rui.<ext>')
def details_rui_ext(type, uuid, ext):
    # Note that the API returns a blob of JSON as a string,
    # so, to return a JSON object, and not just a string, we need to decode.
    if type not in entity_types:
        abort(404)
    if ext != 'json':
        abort(404)
    client = _get_client()
    entity = client.get_entity(uuid)
    # For Samples...
    if 'rui_location' in entity:
        return json.loads(entity['rui_location'])
    # For Datasets...
    if 'ancestors' not in entity:
        abort(404)
    located_ancestors = [a for a in entity['ancestors'] if 'rui_location' in a]
    if not located_ancestors:
        abort(404)
    # There may be multiple: The last should be the closest...
    # but this should be confirmed, when there are examples.
    return json.loads(located_ancestors[-1]['rui_location'])


@blueprint.route('/search')
def search():
    entity_type = request.args.get('entity_type[0]')
    title = f'{entity_type}s' if entity_type else 'Search'
    flask_data = {
        'endpoints': _get_endpoints(),
        'title': title
    }
    return render_template(
        'pages/base_react.html',
        title=title,
        types=entity_types,
        flask_data=flask_data
    )


@blueprint.route('/dev-search')
def dev_search():
    title = 'Dev Search'
    flask_data = {
        'endpoints': _get_endpoints(),
        'title': title
    }
    return render_template(
        'pages/base_react.html',
        title=title,
        types=entity_types,
        flask_data=flask_data
    )


@blueprint.route('/preview/<name>')
def preview_view(name):
    filename = dirname(__file__) + '/preview/' + name + '.md'
    metadata_content = frontmatter.load(filename)
    preview_metadata = metadata_content.metadata
    markdown = metadata_content.content
    flask_data = {
        'title': preview_metadata['title'],
        'markdown': markdown,
        'entity': {
            'group_name': preview_metadata['group_name'],
            'created_by_user_displayname': preview_metadata['created_by_user_displayname'],
            'created_by_user_email': preview_metadata['created_by_user_email'],
        },
        'vitessce_conf':
            ('vitessce_conf' in preview_metadata) and preview_metadata['vitessce_conf']
    }
    return render_template(
        'pages/base_react.html',
        title='Preview',
        flask_data=flask_data
    )


@blueprint.route('/cells-api-demo')
def cells_api_demo():
    flask_data = {'endpoints': _get_endpoints()}
    return render_template(
        'pages/base_react.html',
        title='Cells API Demo',
        flask_data=flask_data
    )


@blueprint.route('/collections')
def collections():
    flask_data = {'endpoints': _get_endpoints()}
    return render_template(
        'pages/base_react.html',
        title='Collections',
        flask_data=flask_data
    )


@blueprint.route('/my-lists')
def my_lists():
    flask_data = {'endpoints': _get_endpoints()}
    return render_template(
        'pages/base_react.html',
        title='My Lists',
        flask_data=flask_data
    )


@blueprint.route('/my-lists/<saved_list_uuid>')
def list_page(saved_list_uuid):
    flask_data = {'endpoints': _get_endpoints(), 'list_uuid': saved_list_uuid}
    return render_template(
        'pages/base_react.html',
        title='Saved List',
        flask_data=flask_data
    )


@blueprint.route('/robots.txt')
def robots_txt():
    allowed_hostname = 'portal.hubmapconsortium.org'
    hostname = urlparse(request.base_url).hostname
    disallow = '/search' if hostname == allowed_hostname else '/'
    return Response(
        f'''
# This host: {hostname}
# Allowed host: {allowed_hostname}
User-agent: *
Disallow: {disallow}
Sitemap: {get_url_base_from_request()}/sitemap.txt
''',
        mimetype='text/plain')


@blueprint.route('/sitemap.txt')
def sitemap_txt():
    client = _get_client()
    uuids = client.get_all_dataset_uuids()
    url_base = get_url_base_from_request()
    return Response(
        '\n'.join(
            f'{url_base}/browse/dataset/{uuid}' for uuid in uuids
        ),
        mimetype='text/plain')


def get_url_base_from_request():
    parsed = urlparse(request.base_url)
    scheme = parsed.scheme
    netloc = parsed.netloc
    return f'{scheme}://{netloc}'
