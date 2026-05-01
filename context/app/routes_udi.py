import hashlib
import json
import os
import time

from flask import current_app, jsonify, make_response, request, session

from udiagent import Orchestrator, UDIAgent

from .routes_api import (
    _first_fields,
    _generate_tsv_response,
    _get_api_json_error,
    _get_entities,
    _get_recent_description,
)
from .utils import (
    get_allowed_cors_origin,
    get_client,
    get_url_base_from_request,
    make_blueprint,
)
from .utils_datapackage import build_resource, resolve_field_type


blueprint = make_blueprint(__name__)

# Matches the permission key used in routes_auth.py's permission_groups dict.
HUBMAP_READ_GROUP = 'HuBMAP'

_UDI_CACHE_TTL = 43200  # 12 hours
_udi_cache = {}

# Two orchestrators: one pre-configured with the server's OPENAI_API_KEY
# (for HuBMAP-Read users), and one without a default key (per-request
# X-OpenAI-Key required).
_udi_orchestrator_hubmap = None
_udi_orchestrator_byok = None


def _is_authenticated():
    return bool(session.get('groups_token'))


def _is_hubmap_read_user():
    return _is_authenticated() and HUBMAP_READ_GROUP in (session.get('user_groups') or [])


def _get_cached(key):
    if key in _udi_cache:
        ts, data = _udi_cache[key]
        if time.time() - ts < _UDI_CACHE_TTL:
            return data
        del _udi_cache[key]
    return None


def _set_cached(key, data):
    _udi_cache[key] = (time.time(), data)


# Fields to strip from UDI responses. `assaytype` overlaps semantically with the
# dataset_type field and creates confusion in the chat UI's schema.
_UDI_EXCLUDED_FIELDS = ['assaytype']


def _wants_public_scope():
    """Logged-in users can opt in to the cached public datapackage/TSVs by
    appending ?public=1, trading per-user data access for shared-cache speed."""
    return request.args.get('public') in ('1', 'true')


def _serve_in_public_scope():
    return not _is_authenticated() or _wants_public_scope()


def _apply_cache_headers(response, *, public, etag_payload=None):
    """Cacheable when the response is generated in public scope; otherwise
    `private, no-store` to prevent shared caches from leaking authed data."""
    if public:
        response.headers['Cache-Control'] = f'public, max-age={_UDI_CACHE_TTL}'
        if etag_payload is not None:
            response.headers['ETag'] = f'"{hashlib.md5(etag_payload).hexdigest()}"'  # noqa: S324  (non-security ETag)
    else:
        response.headers['Cache-Control'] = 'private, no-store'
    return response


_UDI_ALLOWED_ORIGINS = ['https://hms-dbmi.github.io']
# Extra origins allowed when the app is running in dev/test mode (Flask's
# --debug flag or TESTING=True) so the standalone chat frontend on Vite's
# default port can call the API locally.
_UDI_DEV_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
]
_UDI_ALLOWED_HEADERS = 'Content-Type, Authorization, X-OpenAI-Key'
_UDI_ALLOWED_METHODS = 'GET, POST, OPTIONS'


def _udi_cors_origin():
    allowed_origins = list(_UDI_ALLOWED_ORIGINS)
    if current_app.debug or current_app.testing:
        allowed_origins.extend(_UDI_DEV_ALLOWED_ORIGINS)
    request_origin = request.headers.get('Origin', '')
    return get_allowed_cors_origin(
        request_origin,
        allowed_origins=allowed_origins,
        allowed_domain_suffixes=['.hubmapconsortium.org'],
    )


@blueprint.after_request
def _udi_cors_after_request(response):
    # Runs on every response from this blueprint — including Flask's
    # auto-generated OPTIONS preflight — so individual view functions don't
    # need to set CORS headers themselves.
    cors_origin = _udi_cors_origin()
    if cors_origin:
        response.headers['Access-Control-Allow-Origin'] = cors_origin
        response.headers['Access-Control-Allow-Methods'] = _UDI_ALLOWED_METHODS
        response.headers['Access-Control-Allow-Headers'] = _UDI_ALLOWED_HEADERS
        response.headers['Vary'] = 'Origin'
    return response


def _build_orchestrator(openai_api_key):
    agent = UDIAgent(
        gpt_model_name=current_app.config.get('UDI_GPT_MODEL_NAME', 'gpt-5.4'),
        openai_api_key=openai_api_key,
        langfuse_public_key=current_app.config.get('LANGFUSE_PUBLIC_KEY'),
        langfuse_secret_key=current_app.config.get('LANGFUSE_SECRET_KEY'),
        langfuse_host=current_app.config.get('LANGFUSE_BASE_URL'),
    )
    return Orchestrator(agent=agent)


def _get_hubmap_orchestrator():
    """Return a cached Orchestrator whose agent is pre-configured with the
    server-side OPENAI_API_KEY (from app config)."""
    global _udi_orchestrator_hubmap
    if _udi_orchestrator_hubmap is None:
        _udi_orchestrator_hubmap = _build_orchestrator(current_app.config.get('OPENAI_API_KEY'))
    return _udi_orchestrator_hubmap


def _get_byok_orchestrator():
    """Return a cached Orchestrator whose agent has no default key.
    Callers must supply an OpenAI key per-request via X-OpenAI-Key."""
    global _udi_orchestrator_byok
    if _udi_orchestrator_byok is None:
        _udi_orchestrator_byok = _build_orchestrator(None)
    return _udi_orchestrator_byok


def _pick_orchestrator():
    """Route a /v1/yac/completions request to the right orchestrator.

    Returns (orchestrator, per_request_key_or_None). The per-request key is
    None for HuBMAP-Read users (the agent already has the server key); for
    everyone else it's the X-OpenAI-Key header value. Returns (None, None) if
    the caller has no usable key.
    """
    if _is_hubmap_read_user() and current_app.config.get('OPENAI_API_KEY'):
        return _get_hubmap_orchestrator(), None
    header_key = request.headers.get('X-OpenAI-Key')
    if not header_key:
        return None, None
    return _get_byok_orchestrator(), header_key


# This endpoint is for the UDI demo site - produces plain TSV without descriptions and
# removes CORS block.
@blueprint.route('/metadata/v0/udi/<entity_type>.tsv', methods=['GET', 'POST'])
def entities_plain_tsv(entity_type):
    public_scope = _serve_in_public_scope()

    if public_scope:
        cached = _get_cached(f'tsv:{entity_type}')
        if cached:
            tsv, filename = cached
            response = make_response(tsv)
            response.headers['Content-Type'] = 'text/tab-separated-values; charset=utf-8'
            response.headers['Content-Disposition'] = f'attachment; filename={filename}'
            return _apply_cache_headers(response, public=True, etag_payload=tsv.encode('utf-8'))

    response = _generate_tsv_response(
        entity_type,
        with_descriptions=False,
        use_groups_token=not public_scope,
        excluded_fields=_UDI_EXCLUDED_FIELDS,
        exclude_revisions=True,
    )

    if public_scope:
        tsv = response.get_data(as_text=True)
        filename = response.headers.get('Content-Disposition', '').split('filename=')[-1]
        _set_cached(f'tsv:{entity_type}', (tsv, filename))
        return _apply_cache_headers(response, public=True, etag_payload=tsv.encode('utf-8'))

    return _apply_cache_headers(response, public=False)


@blueprint.route('/metadata/v0/udi/datapackage.json', methods=['GET'])
def udi_datapackage():
    # This endpoint serves the datapackage.json used to power the UDI chat.
    #
    # Anonymous users — and authenticated users who pass ?public=1 — are served
    # from a 12-hour shared cache for fast Say & See open times. Authenticated
    # users without ?public=1 get a fresh build under their own groups_token so
    # the datapackage reflects their actual data access.
    public_scope = _serve_in_public_scope()

    if public_scope:
        cached = _get_cached('datapackage')
        if cached:
            response = jsonify(cached)
            return _apply_cache_headers(
                response,
                public=True,
                etag_payload=json.dumps(cached, sort_keys=True).encode('utf-8'),
            )

    client = get_client(use_groups_token=not public_scope)

    field_descriptions_raw = client.get_metadata_descriptions()
    descriptions_dict = {
        d['name']: _get_recent_description(d['descriptions']) for d in field_descriptions_raw
    }

    field_types_raw = client.get_metadata_field_types()
    types_dict = {ft['name']: resolve_field_type(ft) for ft in field_types_raw}

    resources = []
    for entity_type in ['donors', 'samples', 'datasets']:
        entities = _get_entities(
            entity_type,
            use_groups_token=not public_scope,
            excluded_fields=_UDI_EXCLUDED_FIELDS,
            exclude_revisions=True,
        )
        resource = build_resource(
            entity_type,
            entities,
            descriptions_dict,
            types_dict,
            _first_fields,
            _wants_public_scope(),
        )
        resources.append(resource)

    datapackage = {
        'name': 'hubmap_metadata',
        'resources': resources,
        'udi:name': 'hubmap_api',
        'udi:path': f'{get_url_base_from_request()}/metadata/v0/udi/',
    }

    response = jsonify(datapackage)
    if public_scope:
        _set_cached('datapackage', datapackage)
        return _apply_cache_headers(
            response,
            public=True,
            etag_payload=json.dumps(datapackage, sort_keys=True).encode('utf-8'),
        )

    return _apply_cache_headers(response, public=False)


@blueprint.route('/v1/yac/completions', methods=['POST'])
def yac_completions():
    body = request.get_json(silent=True) or {}
    messages = body.get('messages')
    data_schema = body.get('dataSchema')
    data_domains = body.get('dataDomains')
    if messages is None or data_schema is None or data_domains is None:
        return _get_api_json_error(
            400, 'Request body must include messages, dataSchema, and dataDomains.'
        ), 400

    orchestrator, openai_api_key = _pick_orchestrator()
    if orchestrator is None:
        return _get_api_json_error(
            401,
            'OpenAI key required: enter your OpenAI key, or sign in as a HuBMAP member.',
        ), 401

    try:
        result = orchestrator.run(
            messages=messages,
            data_schema=data_schema,
            data_domains=data_domains,
            openai_api_key=openai_api_key,
        )
    except Exception as e:
        current_app.logger.exception('UDIAgent orchestrator failed')
        return _get_api_json_error(500, f'UDIAgent orchestration error: {e}'), 500

    return jsonify(result.tool_calls)


@blueprint.route('/v1/yac/examples', methods=['GET'])
def yac_examples():
    examples_path = os.path.join(os.path.dirname(__file__), 'udi_example_prompts.json')
    with open(examples_path) as f:
        prompts = json.load(f)
    return jsonify(prompts)
