from flask import Blueprint, render_template, abort, current_app, flash

from yaml import safe_load as load_yaml

from .api.client import get_client
from .render_utils import object_as_html
from .config import types
from .validation_utils import for_each_validation_error


blueprint = Blueprint('routes', __name__, template_folder='templates')


@blueprint.route('/')
def index():
    return render_template('pages/index.html', types=types)


@blueprint.route('/browse/<type>')
def browse(type):
    if type not in types:
        abort(404)
    entities = get_client().get_entities(type)
    return render_template('pages/browse.html', types=types, type=type, entities=entities)


@blueprint.route('/browse/<type>/<uuid>')
def details(type, uuid):
    if type not in types:
        abort(404)
    client = get_client()

    entity = client.get_entity(uuid)
    # TODO: These schemas don't need to be reloaded per request.
    with open(current_app.root_path + '/schemas/entity.yml') as entity_schema_file:
        entity_schema = load_yaml(entity_schema_file)
    for_each_validation_error(entity, entity_schema, flash)
    with open(current_app.root_path + f'/schemas/{type}.yml') as type_schema_file:
        type_schema = load_yaml(type_schema_file)
    for_each_validation_error(entity, type_schema, flash)

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
        provenance=provenance,
        vitessce_conf=client.get_vitessce_conf()
    )


@blueprint.route('/browse/<type>/<uuid>.<ext>')
def details_ext(type, uuid, ext):
    if type not in types:
        abort(404)
    if ext != 'json':
        abort(404)
    client = get_client()

    entity = client.get_entity(uuid)
    return entity


@blueprint.route('/search')
def search():
    return render_template('pages/search.html', types=types)
