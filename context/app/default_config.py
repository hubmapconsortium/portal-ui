from datetime import timedelta


# By keeping this in code rather than configuration,
# we can atomically release changes that uses new service features,
# rather than requiring backward compatibility from new API versions.
version = 'v3'


class DefaultConfig(object):
    # This should be updated when app.conf is updated:
    # Test runs will only see this config and not app.conf.
    #
    # Tests should not make API calls...
    # but they may expect certain keys to be present,
    # so we provide placeholders here.

    PERMANENT_SESSION_LIFETIME = timedelta(minutes=60)
    SESSION_COOKIE_SAMESITE = 'Lax'

    # These app-wide configurations do not vary between environments:
    VERSION = version
    PORTAL_INDEX_PATH = f'/{version}/portal/search'
    CCF_INDEX_PATH = f'{version}/entities/search'
    GLOBUS_GROUPS_URL = (
        'https://raw.githubusercontent.com'
        + '/hubmapconsortium/commons/main/hubmap_commons/21f293b0-globus-groups.json'
    )
    SOFT_ASSAY_ENDPOINT_PATH = 'assaytype'

    # Everything else should be overridden in app.conf:

    ENTITY_API_BASE = 'should-be-overridden'

    GROUP_ID = 'should-be-overridden'

    GATEWAY_ENDPOINT = 'should-be-overridden'
    ELASTICSEARCH_ENDPOINT = 'should-be-overridden'
    ASSETS_ENDPOINT = 'should-be-overridden'
    XMODALITY_ENDPOINT = 'should-be-overridden'
    WORKSPACES_ENDPOINT = 'should-be-overridden'
    WORKSPACES_WS_ENDPOINT = 'should-be-overridden'
    USER_TEMPLATES_ENDPOINT = 'should-be-overridden'
    UBKG_ENDPOINT = 'should-be-overridden'
    SOFT_ASSAY_ENDPOINT = 'should-be-overridden'
    UKV_ENDPOINT = 'should-be-overridden'
    SCFIND_ENDPOINT = 'should-be-overridden'
    SCFIND_DEFAULT_INDEX_VERSION = ''
    DATA_PRODUCTS_ENDPOINT = 'should-be-overridden'

    SECRET_KEY = 'should-be-overridden'
    APP_CLIENT_ID = 'should-be-overridden'
    APP_CLIENT_SECRET = 'should-be-overridden'

    PROTOCOLS_IO_CLIENT_ID = 'should-be-overridden'
    PROTOCOLS_IO_CLIENT_SECRET = 'should-be-overridden'
    PROTOCOLS_IO_CLIENT_AUTH_TOKEN = 'should-be-overridden'

    SENTRY_ENV = 'should-be-overridden'

    # Optional: server-side OpenAI key used by the UDIAgent for authenticated
    # HuBMAP-Read users. If unset, all callers must supply X-OpenAI-Key.
    OPENAI_API_KEY = None
    UDI_GPT_MODEL_NAME = 'gpt-5.4'

    # Optional: Langfuse observability for UDIAgent. Tracing is enabled when
    # any of these is set; otherwise the plain OpenAI client is used.
    LANGFUSE_PUBLIC_KEY = None
    LANGFUSE_SECRET_KEY = None
    LANGFUSE_BASE_URL = None
