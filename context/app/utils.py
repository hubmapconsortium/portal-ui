from flask import (current_app, session, Blueprint)

from .api.client import ApiClient


def get_client():
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
