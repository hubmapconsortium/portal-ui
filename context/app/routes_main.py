from pathlib import Path

from flask import (Blueprint, render_template, abort, current_app,
                   session, flash, get_flashed_messages,
                   redirect, url_for)

from yaml import safe_load as load_yaml

from .api.client import ApiClient
from .config import types
from .validation_utils import for_each_validation_error


blueprint = Blueprint('routes', __name__, template_folder='templates')

core_props = {'endpoints': {'elasticsearch_endpoint':current_app.config['ELASTICSEARCH_ENDPOINT']}}

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


@blueprint.route('/')
def index():
    return render_template('pages/base_react.html', types=types, flask_data=core_props)


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

    # TODO: These schemas don't need to be reloaded per request.
    schema_path = (
        Path(current_app.root_path).parent / 'search-schema' / 'data'
        / 'schemas' / f'{type}.schema.yaml')
    with open(schema_path) as type_schema_file:
        type_schema = load_yaml(type_schema_file)
    for_each_validation_error(entity, type_schema, flash)

    provenance = client.get_provenance(uuid)
    flashed_messages = []
    errors = get_flashed_messages()

    for error in errors:
        # Traceback trim is a quick fix https://github.com/hubmapconsortium/portal-ui/issues/145.
        flashed_messages.append({'message': error.message,
                                 'issue_url': error.issue_url,
                                 'traceback': error.__str__()[0:1500]})

    template = f'pages/base_react.html'
    props = core_props.update({
        'flashed_messages': flashed_messages,
        'entity': entity,
        'provenance': provenance,
        'vitessce_conf': client.get_vitessce_conf(),
    })
    return render_template(
        template, type=type, uuid=uuid,
        title_text='TODO: title_text',
        flask_data=props
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
    if 'nexus_token' not in session:
        abort(403)
    return render_template(
        'pages/base_react.html',
        types=types,
        flask_data= core_props,
    )
