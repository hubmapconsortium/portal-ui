from datetime import timedelta


class DefaultConfig(object):
    # This should be updated when app.conf is updated:
    # Test runs will see this config rather than app.conf.
    # Tests should not make API calls...
    # but they may expect certain keys to be present.

    PERMANENT_SESSION_LIFETIME = timedelta(minutes=60)

    ENTITY_API_TIMEOUT = 5
    ENTITY_API_BASE = 'should-be-overridden'

    GROUP_ID = 'should-be-overridden'

    CCF_ELASTICSEARCH_ENDPOINT = 'should-be-overridden'
    PORTAL_ELASTICSEARCH_ENDPOINT = 'should-be-overridden'
    ASSETS_ENDPOINT = 'should-be-overridden'

    SECRET_KEY = 'should-be-overridden'
    APP_CLIENT_ID = 'should-be-overridden'
    APP_CLIENT_SECRET = 'should-be-overridden'
