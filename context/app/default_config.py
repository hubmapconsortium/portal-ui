from datetime import timedelta


class DefaultConfig(object):
    # This should be updated when app.conf is updated:
    # Test runs will only see this config and not app.conf.
    #
    # Tests should not make API calls...
    # but they may expect certain keys to be present,
    # so we provide placeholders here.

    PERMANENT_SESSION_LIFETIME = timedelta(minutes=60)
    SESSION_COOKIE_SAMESITE = 'Lax'

    PORTAL_INDEX_PATH = '/portal/v3'
    CCF_INDEX_PATH = '/entities/search'

    # Everything else should be overridden in app.conf:

    ENTITY_API_BASE = 'should-be-overridden'

    GROUP_ID = 'should-be-overridden'

    GATEWAY_ENDPOINT = 'should-be-overridden'
    ELASTICSEARCH_ENDPOINT = 'should-be-overridden'
    ASSETS_ENDPOINT = 'should-be-overridden'
    XMODALITY_ENDPOINT = 'should-be-overridden'
    WORKSPACES_ENDPOINT = 'should-be-overridden'
    WORKSPACES_WS_ENDPOINT = 'should-be-overridden'

    SECRET_KEY = 'should-be-overridden'
    APP_CLIENT_ID = 'should-be-overridden'
    APP_CLIENT_SECRET = 'should-be-overridden'
