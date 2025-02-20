from urllib.parse import urlparse
from flask import (current_app, request, session, Blueprint)

from portal_visualization.client import ApiClient
from portal_visualization.mock_client import MockApiClient
from os.path import dirname
from pathlib import Path

from yaml import safe_load

entity_types = ['donor', 'sample', 'dataset', 'support', 'collection', 'publication']


def get_client():
    if current_app.config.get('IS_MOCK'):
        return MockApiClient()
    return ApiClient(
        groups_token=session['groups_token'],
        elasticsearch_endpoint=current_app.config['ELASTICSEARCH_ENDPOINT'],
        portal_index_path=current_app.config['PORTAL_INDEX_PATH'],
        ubkg_endpoint=current_app.config['UBKG_ENDPOINT'],
        assets_endpoint=current_app.config['ASSETS_ENDPOINT'],
        soft_assay_endpoint=current_app.config['SOFT_ASSAY_ENDPOINT'],
        soft_assay_endpoint_path=current_app.config['SOFT_ASSAY_ENDPOINT_PATH'],
        entity_api_endpoint=current_app.config['ENTITY_API_BASE'],
    )


def get_default_flask_data():
    return {
        'endpoints': {
            'gatewayEndpoint': current_app.config['GATEWAY_ENDPOINT'],
            'baseElasticsearchEndpoint': current_app.config['ELASTICSEARCH_ENDPOINT']
            + '/' + current_app.config['VERSION'],
            'elasticsearchEndpoint': current_app.config['ELASTICSEARCH_ENDPOINT']
            + current_app.config['PORTAL_INDEX_PATH'],
            'assetsEndpoint': current_app.config['ASSETS_ENDPOINT'],
            'entityEndpoint': current_app.config['ENTITY_API_BASE'],
            'xmodalityEndpoint': current_app.config['XMODALITY_ENDPOINT'],
            'workspacesEndpoint': current_app.config['WORKSPACES_ENDPOINT'],
            'userTemplatesEndpoint': current_app.config['USER_TEMPLATES_ENDPOINT'],
            'workspacesWsEndpoint': current_app.config['WORKSPACES_WS_ENDPOINT'],
            'protocolsClientId': current_app.config['PROTOCOLS_IO_CLIENT_ID'],
            'protocolsClientToken': current_app.config['PROTOCOLS_IO_CLIENT_AUTH_TOKEN'],
            'ubkgEndpoint': current_app.config['UBKG_ENDPOINT'],
            'softAssayEndpoint': current_app.config['SOFT_ASSAY_ENDPOINT'],
            'ukvEndpoint': current_app.config['UKV_ENDPOINT'],
        },
        'globalAlertMd': current_app.config.get('GLOBAL_ALERT_MD')
    }


def make_blueprint(name):
    return Blueprint(name.split('.')[-1], name, template_folder='templates')


def get_url_base_from_request():
    parsed = urlparse(request.base_url)
    scheme = parsed.scheme
    netloc = parsed.netloc
    return f'{scheme}://{netloc}'


def get_organs():
    dir_path = Path(dirname(__file__) + '/organ')
    organs = {p.stem: safe_load(p.read_text()) for p in dir_path.glob('*.yaml')}
    return organs


def get_organ_name_mapping():
    organs = get_organs()
    organ_file_names = {k: k for k, _ in organs.items()}
    # Add search field for each organ as additional keys
    for k, v in organs.items():
        search = v['search']
        if len(search) > 0:
            for s in search:
                organ_file_names[s.lower()] = k
    return organ_file_names


# Redirect to primary dataset if this entity is
# - non-existent
# - a support entity (e.g. an image pyramid)
# - a processed or component dataset
def should_redirect_entity(entity):
    if not entity:
        return True

    actual_type = entity.get('entity_type').lower()
    is_support_type = actual_type == 'support'
    is_component = entity.get('is_component', False) is True
    is_not_raw_dataset = entity.get('processing') != 'raw' and actual_type == 'dataset'

    if is_support_type or is_component or is_not_raw_dataset:
        return True

    return False


def find_raw_dataset_ancestor(client, ancestor_ids):
    return client.get_entities(
        'datasets',
        query_override={
            "bool": {
                "must": [
                    {
                        "term": {
                            "processing": "raw"
                        }
                    },
                    {
                        "terms": {
                            "uuid": ancestor_ids
                        }
                    },
                ],
                "must_not": [
                    {
                        "exists": {
                            "field": "ancestor_counts.entity_type.Dataset"
                        }
                    }
                ]
            }
        },
        non_metadata_fields=[
            'uuid',
            'processing',
            'entity_type',
            'is_component'
        ]
    )
