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


def get_epics_pyramid_entity(client, uuid):
    """
        Retrieves the entity for the base image-pyramid for EPIC segmentation masks
        by searching through the descendants of the parent and looking for the latest
        centrally processed dataset.

        Parameters:
        client : API client
        uuid (str): The unique identifier of the parent entity whose descendants will be searched.

        Returns:
            dict: The entity dictionary representing the most recent centrally processed
            image-pyramid dataset, or None if no suitable dataset is found.

    """
    entity = client.get_entity(uuid)
    descendants = entity.get('descendant_ids')
    max_date_descendant = None
    descendant_entities = []
    try:
        query_override = {
            "bool": {
                "must": [
                    {
                        "terms": {
                            "uuid": descendants
                        }
                    },
                    {
                        "terms": {
                            "mapped_status.keyword": ["QA"]
                        }
                    },
                    {
                        "term": {
                            "creation_action.keyword": "Central Process"
                        }
                    }
                ]
            }
        }
        fields = ['uuid',
                  'last_modified_timestamp']
        descendant_entities = client.get_entities(plural_lc_entity_type='datasets',
                                                  query_override=query_override, non_metadata_fields=fields)
    except Exception as e:
        print(f"Error retrieving descendant entities {str(e)}")

    max_last_modified = max(descendant_entities,
                            key=lambda x: x['last_modified_timestamp']) or None
    if max_last_modified is not None:
        max_date_descendant = client.get_entity(max_last_modified['uuid'])
    return max_date_descendant
