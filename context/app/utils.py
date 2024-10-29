from urllib.parse import urlparse
from flask import (current_app, request, session, Blueprint)

from portal_visualization.client import ApiClient
from portal_visualization.mock_client import MockApiClient
from os.path import dirname
from pathlib import Path
from datetime import datetime

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

def get_epics_pyramid_entity(uuid):
    client = get_client()
    entity = client.get_entity(uuid)
    decendents = entity.get('descendant_ids')
    max_modified_date =  None
    max_date_decendent = None
    for decendent in decendents:
        dec_entity = client.get_entity(decendent)
        if dec_entity.get('creation_action').lower() == 'central process':
            mapped_last_modified_timestamp = datetime.strptime(dec_entity.get('mapped_last_modified_timestamp'), "%Y-%m-%d %H:%M:%S")
            if max_modified_date is None or mapped_last_modified_timestamp > max_modified_date:
                max_modified_date = mapped_last_modified_timestamp
                max_date_decendent = dec_entity 
    return max_date_decendent