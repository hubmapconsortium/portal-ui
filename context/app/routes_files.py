"""
Caching proxy for files-index facet aggregations.

The files index is ~10M documents, and the per-facet ``filter`` aggregations the search
page needs take 2.7-4.4s against it. Those aggregations are identical for every user in a
given scope, so they are cached here rather than being issued per browser.

Only the *aggregations* go through Flask. The result hits still go straight from the
browser to search-api (as every other portal search does), because ``collapse`` +
``inner_hits`` is already fast (~110ms) and posting with the user's own token is what
selects the public vs. private index correctly.

Scope and cache safety
----------------------
search-api picks the private index iff the caller's token has read privileges, and
otherwise the public one; it injects no per-user filtering on top of that. So results are
uniform within a scope, and a two-key public/private cache matches exactly the
granularity search-api itself enforces.

The cache key is derived from *the request this process made upstream*, not from a guess
about what a token grants: with no session token we send no ``Authorization`` header at
all, so the response is public by construction. If a forwarded token turns out to lack
read privileges, search-api returns public data and we cache public data under the
``private`` key -- over-restrictive, never leaky.
"""

from hashlib import sha256
import json

import requests
from flask import current_app, jsonify, request, session

from .cache_utils import CacheNamespace, get_or_build, prune
from .utils import make_blueprint


blueprint = make_blueprint(__name__)


FILES_FACET_CACHE = CacheNamespace(
    dir_name='files-facet-cache',
    dir_config_key='FILES_FACET_CACHE_DIR',
    ttl_config_key='FILES_FACET_CACHE_TTL',
    token_env_var='SCFIND_CACHE_TOKEN',
)

# Aggregation bodies are small (the full facet set serializes to a few KB). This only has
# to be loose enough for a legitimate query while refusing to act as a general-purpose
# cache for arbitrary payloads.
MAX_QUERY_BYTES = 64 * 1024

FILES_FACET_TIMEOUT = 60  # seconds; a cold aggregation over ~10M docs can take seconds


def _validate_aggregation_query(body):
    """
    Return an error string if ``body`` is not an aggregation-only query.

    This endpoint forwards a caller-supplied ES body, so it is restricted to the shape it
    exists to serve: aggregations with no hits. That keeps it from being usable as a cache
    for document content, which would sidestep the per-request scope check by letting one
    caller's documents be served to another from cache.
    """
    if not isinstance(body, dict):
        return 'Request body must be a JSON object.'
    if body.get('size') != 0:
        return "Request body must set 'size' to 0; this endpoint returns aggregations only."
    aggs = body.get('aggs') or body.get('aggregations')
    if not isinstance(aggs, dict) or not aggs:
        return "Request body must include a non-empty 'aggs' object."
    for forbidden in ('collapse', 'search_after', 'sort'):
        if forbidden in body:
            return f"Request body may not include '{forbidden}'."
    return None


def _cache_name(scope, body):
    """Cache entry name for a scope and query body.

    ``sort_keys`` makes the digest independent of key ordering, so semantically identical
    bodies share one entry.
    """
    digest = sha256(json.dumps(body, sort_keys=True).encode()).hexdigest()[:32]
    return f'{scope}.{digest}'


def _fetch_facets(body, groups_token):
    """POST an aggregation body to the files index and return its ``aggregations`` block."""
    url = current_app.config['ELASTICSEARCH_ENDPOINT'] + current_app.config['FILES_INDEX_PATH']
    headers = {'Content-Type': 'application/json'}
    # Deliberately omitted when there is no token: an unauthenticated upstream request
    # makes the cached artifact public by construction.
    if groups_token:
        headers['Authorization'] = f'Bearer {groups_token}'

    response = requests.post(url, json=body, headers=headers, timeout=FILES_FACET_TIMEOUT)
    # search-api stashes oversized responses in S3 and answers 303 with the URL. Facet
    # responses are small, but follow it rather than failing if that ever changes.
    if response.status_code == 303:
        response = requests.get(response.text.strip(), timeout=FILES_FACET_TIMEOUT)
    response.raise_for_status()
    payload = response.json()

    if 'error' in payload:
        raise ValueError(f'Elasticsearch error: {json.dumps(payload["error"])[:500]}')

    # Only the aggregations are returned. `hits.total` is deliberately not: without
    # `track_total_hits` Elasticsearch caps it at 10,000, so it would silently understate large
    # result sets. The caller's group-count aggregation carries both an exact document count
    # (its `doc_count`) and the distinct-group count.
    return {'aggregations': payload.get('aggregations', {})}


@blueprint.route('/api/files/facets', methods=['POST'])
def files_facets():
    body = request.get_json(silent=True)

    error = _validate_aggregation_query(body)
    if error:
        return jsonify({'error': error}), 400

    serialized = json.dumps(body)
    if len(serialized) > MAX_QUERY_BYTES:
        return jsonify({'error': 'Request body is too large.'}), 413

    groups_token = session.get('groups_token') or ''
    scope = 'private' if groups_token else 'public'

    try:
        result = get_or_build(
            FILES_FACET_CACHE,
            _cache_name(scope, body),
            lambda: _fetch_facets(body, groups_token),
        )
    except requests.exceptions.Timeout:
        current_app.logger.error('Timeout fetching files facet aggregations.')
        return jsonify({'error': 'The search server took too long to respond.'}), 504
    except Exception as e:
        current_app.logger.error(f'Error fetching files facet aggregations: {e}')
        return jsonify({'error': 'An error occurred while loading filters.'}), 502

    # The filter space is unbounded, so keep the number of entries capped.
    prune(FILES_FACET_CACHE, current_app.config.get('FILES_FACET_CACHE_MAX_ENTRIES'))

    return jsonify(result)
