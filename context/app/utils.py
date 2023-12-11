from urllib.parse import urlparse
from flask import (current_app, request, session, Blueprint)

from .api.client import ApiClient
from .api.mock_client import MockApiClient
from os.path import dirname
from pathlib import Path

from yaml import safe_load

entity_types = ['donor', 'sample', 'dataset', 'support', 'collection', 'publication']


def get_client():
    if current_app.config.get('IS_MOCK'):
        return MockApiClient()
    return ApiClient(
        current_app.config['ENTITY_API_BASE'],
        session['groups_token']
    )


def get_default_flask_data():
    return {
        'endpoints': {
            'gatewayEndpoint': current_app.config['GATEWAY_ENDPOINT'],
            'elasticsearchEndpoint': current_app.config['ELASTICSEARCH_ENDPOINT']
            + current_app.config['PORTAL_INDEX_PATH'],
            'typeServiceEndpoint': current_app.config['TYPE_SERVICE_ENDPOINT']
            + current_app.config['TYPE_SERVICE_PATH'],
            'assetsEndpoint': current_app.config['ASSETS_ENDPOINT'],
            'entityEndpoint': current_app.config['ENTITY_API_BASE'],
            'xmodalityEndpoint': current_app.config['XMODALITY_ENDPOINT'],
            'workspacesEndpoint': current_app.config['WORKSPACES_ENDPOINT'],
            'userTemplatesEndpoint': current_app.config['USER_TEMPLATES_ENDPOINT'],
            'workspacesWsEndpoint': current_app.config['WORKSPACES_WS_ENDPOINT'],
            'protocolsClientId': current_app.config['PROTOCOLS_IO_CLIENT_ID'],
            'protocolsClientToken': current_app.config['PROTOCOLS_IO_CLIENT_AUTH_TOKEN'],
            'ubkgEndpoint': current_app.config['UBKG_ENDPOINT'],
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
