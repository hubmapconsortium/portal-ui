from datetime import timedelta


class DefaultConfig(object):
    PERMANENT_SESSION_LIFETIME = timedelta(minutes=60)

    ENTITY_API_TIMEOUT = 5
    ENTITY_API_BASE = 'should-be-overridden'

    GROUP_ID = 'should-be-overridden'

    ELASTICSEARCH_ENDPOINT = 'should-be-overridden'

    SECRET_KEY = 'should-be-overridden'
    APP_CLIENT_ID = 'should-be-overridden'
    APP_CLIENT_SECRET = 'should-be-overridden'
