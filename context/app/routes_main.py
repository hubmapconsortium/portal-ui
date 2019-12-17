from flask import Blueprint, render_template, abort, current_app, session, flash

import jsonschema
from yaml import load as load_yaml

from .api.client import ApiClient
from .render_utils import object_as_html
from .config import types


blueprint = Blueprint('routes', __name__, template_folder='templates')


def _get_client():
    try:
        is_mock = current_app.config['IS_MOCK']
    except KeyError:
        is_mock = False
    return ApiClient(
        current_app.config['ENTITY_API_BASE'],
        session['nexus_token'],
        is_mock=is_mock
    )


@blueprint.route('/')
def index():
    return render_template('pages/index.html', types=types)


@blueprint.route('/browse/<type>')
def browse(type):
    if type not in types:
        abort(404)
    entities = _get_client().get_entities(type)
    return render_template('pages/browse.html', types=types, type=type, entities=entities)


@blueprint.route('/browse/<type>/<uuid>')
def details(type, uuid):
    if type not in types:
        abort(404)
    client = _get_client()

    entity = client.get_entity(uuid)
    entity_schema = load_yaml(open(current_app.root_path + '/schemas/entity.yml'))
    validator = jsonschema.Draft7Validator(entity_schema)
    for error in validator.iter_errors(entity):
        schema_cursor = entity_schema
        path = list(error.schema_path)
        path[-1] = path[-1] + '_TODO'
        for path_component in path:
            if path_component in schema_cursor:
                schema_cursor = schema_cursor[path_component]
            else:
                schema_cursor = None
                break
        error.issue_url = schema_cursor
        flash(error)

    details_html = object_as_html(entity)
    provenance = client.get_provenance(uuid)

    if type in {'file'}:  # TODO: As we have other specializations, add them here.
        template = f'pages/details/details_{type}.html'
    else:
        template = f'pages/details/details_base.html'
    return render_template(
        template, types=types, type=type, uuid=uuid,
        entity=entity,
        details_html=details_html,
        provenance=provenance
    )


@blueprint.route('/search')
def search():
    return render_template('pages/search.html', types=types)
