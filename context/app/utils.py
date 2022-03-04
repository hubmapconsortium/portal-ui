from urllib.parse import urlparse
from flask import (current_app, request, session, Blueprint)

from .api.client import ApiClient
from .api.mock_client import MockApiClient


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
            'elasticsearchEndpoint': current_app.config['ELASTICSEARCH_ENDPOINT']
            + current_app.config['PORTAL_INDEX_PATH'],
            'assetsEndpoint': current_app.config['ASSETS_ENDPOINT'],
            'entityEndpoint': current_app.config['ENTITY_API_BASE'],
            'xmodalityEndpoint': current_app.config['XMODALITY_ENDPOINT'],
            'gatewayEndpoint': current_app.config['GATEWAY_ENDPOINT'],
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
