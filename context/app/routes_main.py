from flask import Blueprint, render_template, abort, current_app, session, flash

from yaml import safe_load as load_yaml

from .api.client import ApiClient
from .render_utils import object_as_html
from .config import types
from .validation_utils import for_each_validation_error


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
        vitessce_conf=_make_vitessce_conf()
    )


def _make_vitessce_conf():
    # TODO: Generate this from the API response.
    return {
      "description": "Spatial organization of the somatosensory cortex revealed by cyclic smFISH",
      "layers": [
        {
          "name": "cells",
          "type": "CELLS",
          "url": "https://s3.amazonaws.com/vitessce-data/0.0.20/master_release/linnarsson/linnarsson.cells.json"
        },
        {
          "name": "clusters",
          "type": "CLUSTERS",
          "url": "https://s3.amazonaws.com/vitessce-data/0.0.20/master_release/linnarsson/linnarsson.clusters.json"
        },
        {
          "name": "factors",
          "type": "FACTORS",
          "url": "https://s3.amazonaws.com/vitessce-data/0.0.20/master_release/linnarsson/linnarsson.factors.json"
        },
        {
          "name": "genes",
          "type": "GENES",
          "url": "https://s3.amazonaws.com/vitessce-data/0.0.20/master_release/linnarsson/linnarsson.genes.json"
        },
        {
          "name": "images",
          "type": "IMAGES",
          "url": "https://s3.amazonaws.com/vitessce-data/0.0.20/master_release/linnarsson/linnarsson.images.json"
        },
        {
          "name": "molecules",
          "type": "MOLECULES",
          "url": "https://s3.amazonaws.com/vitessce-data/0.0.20/master_release/linnarsson/linnarsson.molecules.json"
        },
        {
          "name": "neighborhoods",
          "type": "NEIGHBORHOODS",
          "url": "https://s3.amazonaws.com/vitessce-data/0.0.20/master_release/linnarsson/linnarsson.neighborhoods.json"
        }
      ],
      "name": "Linnarsson",
      "responsiveLayout": {
        "columns": {
          "900": [
            0,
            3,
            5,
            7,
            9
          ],
          "1100": [
            0,
            3,
            6,
            9,
            11
          ],
          "1300": [
            0,
            3,
            7,
            11,
            13
          ],
          "1500": [
            0,
            3,
            8,
            13,
            15
          ]
        },
        "components": [
          {
            "component": "description",
            "props": {
              "description": "Linnarsson: Spatial organization of the somatosensory cortex revealed by cyclic smFISH"
            },
            "x": 0,
            "y": 0
          },
          {
            "component": "cellSets",
            "props": {
              "datasetId": "linnarsson-2018"
            },
            "x": 0,
            "y": 1,
            "h": 3
          },
          {
            "component": "status",
            "x": 0,
            "y": 4
          },
          {
            "component": "spatial",
            "props": {
              "view": {
                "zoom": -6.5,
                "target": [
                  16000,
                  20000,
                  0
                ]
              }
            },
            "x": 1,
            "y": 0,
            "h": 4
          },
          {
            "component": "scatterplot",
            "props": {
              "mapping": "PCA"
            },
            "x": 2,
            "y": 0,
            "h": 2
          },
          {
            "component": "scatterplot",
            "props": {
              "mapping": "t-SNE",
              "view": {
                "zoom": 0.75,
                "target": [
                  0,
                  0,
                  0
                ]
              }
            },
            "x": 2,
            "y": 2,
            "h": 2
          },
          {
            "component": "factors",
            "x": 3,
            "y": 0,
            "h": 2
          },
          {
            "component": "genes",
            "x": 3,
            "y": 2,
            "h": 2
          },
          {
            "component": "heatmap",
            "x": 1,
            "y": 4,
            "w": 3
          }
        ]
      }
    }


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
    return render_template('pages/search.html', types=types)
