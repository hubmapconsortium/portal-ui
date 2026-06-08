from functools import cache, lru_cache
import fcntl
import json
import os
import sys
import tempfile
import threading
import time
import requests
from flask import current_app, jsonify, request
from concurrent.futures import ThreadPoolExecutor, as_completed

from .utils import (
    EXTERNAL_REQUEST_TIMEOUT,
    first_n_matches,
    is_valid_clid,
    is_valid_gene_symbol,
    make_blueprint,
    parse_pathway_genes_request,
    validate_pathway_genes,
)


blueprint = make_blueprint(__name__)


TIMEOUT_ERROR_MESSAGE = 'The scFind server took too long to respond. Please try again.'


def _handle_scfind_error(e, context):
    """Return an appropriate error response for scFind endpoint failures."""
    if isinstance(e, requests.exceptions.Timeout):
        current_app.logger.error(f'Timeout in {context}: {e}')
        return jsonify({'error': TIMEOUT_ERROR_MESSAGE}), 504
    current_app.logger.error(f'Error in {context}: {e}')
    return jsonify({'error': 'An error occurred while querying scFind. Please try again.'}), 500


# In-process memo of the aggregate maps, keyed by cache name. Guards against
# re-reading the shared file on every request within a worker. The shared file
# (below) is what makes the expensive build happen once per deploy across all
# gunicorn worker processes.
_memory_cache = {}
_memory_lock = threading.Lock()


def _scfind_cache_dir():
    """Directory backing the cross-process scfind map cache (created on demand).

    Defaults to a subdir of the system temp dir, which is writable by the
    non-root container user and ephemeral (so each deploy starts fresh).
    """
    cache_dir = current_app.config.get('SCFIND_CACHE_DIR') or os.path.join(
        tempfile.gettempdir(), 'scfind-cache'
    )
    os.makedirs(cache_dir, exist_ok=True)
    return cache_dir


def _scfind_cache_path(name):
    """Path to the JSON file for a given map.

    Keyed by the index version (when one is pinned) and, in production, by a
    per-server-start token (``SCFIND_CACHE_TOKEN``, set by gunicorn's
    ``on_starting`` hook). The token makes the cache regenerate on each server
    start: all workers of one server share the same token (it's inherited at
    fork) and so share one freshly built file, while the next start gets a new
    token. In development there is no gunicorn and thus no token, so the filename
    is stable across restarts and the cache persists until it ages out
    (``SCFIND_CACHE_TTL``). The index version is usually blank (the server picks
    the latest), so it can't be relied on alone to invalidate the cache.
    """
    version = current_app.config.get('SCFIND_DEFAULT_INDEX_VERSION') or 'latest'
    token = os.environ.get('SCFIND_CACHE_TOKEN')
    parts = [name, version, token] if token else [name, version]
    safe = '.'.join(p.replace('/', '_').replace(os.sep, '_') for p in parts)
    return os.path.join(_scfind_cache_dir(), f'{safe}.json')


def _get_or_build_map(name, builder):
    """
    Return an aggregate scfind map, building it at most once across all worker
    processes.

    Resolution order: in-process memo -> shared JSON file on disk -> build it.
    The build is serialized with an exclusive ``fcntl.flock`` so that, even when
    every gunicorn worker warms at startup simultaneously, only the first to
    acquire the lock actually calls scfind; the rest block briefly and then load
    the file the winner wrote. The file is written atomically (temp + rename).

    A disk file older than ``SCFIND_CACHE_TTL`` seconds is treated as stale and
    rebuilt. This is what bounds staleness in development (the per-start token
    handles production); set the TTL to ``None``/``0`` to disable expiry.
    """
    with _memory_lock:
        if name in _memory_cache:
            return _memory_cache[name]

    path = _scfind_cache_path(name)
    ttl = current_app.config.get('SCFIND_CACHE_TTL')
    lock_path = f'{path}.lock'
    with open(lock_path, 'w') as lock_file:
        fcntl.flock(lock_file, fcntl.LOCK_EX)
        try:
            fresh = os.path.exists(path)
            if fresh and ttl and (time.time() - os.path.getmtime(path)) > ttl:
                fresh = False  # aged out -> rebuild
            if fresh:
                with open(path) as data_file:
                    data = json.load(data_file)
                current_app.logger.info(
                    "Loaded scfind '%s' map from shared cache %s (%d entries).",
                    name,
                    path,
                    len(data),
                )
            else:
                start = time.monotonic()
                data = builder()
                tmp_path = f'{path}.{os.getpid()}.tmp'
                with open(tmp_path, 'w') as tmp_file:
                    json.dump(data, tmp_file)
                os.replace(tmp_path, path)
                current_app.logger.info(
                    "Built scfind '%s' map (%d entries) in %.1fs; cached to %s.",
                    name,
                    len(data),
                    time.monotonic() - start,
                    path,
                )
        finally:
            fcntl.flock(lock_file, fcntl.LOCK_UN)

    with _memory_lock:
        _memory_cache[name] = data
    return data


def warm_scfind_caches(app):
    """
    Pre-build the cell type mappings in a background thread at app startup.

    The aggregate maps are backed by a cross-process disk cache (see
    ``_get_or_build_map``), so the expensive scfind build happens once per deploy
    even though each gunicorn worker runs this warmer: an ``fcntl`` lock ensures
    only the first process builds and the rest load the file it wrote. Warming on
    startup means a real user arrives to an already-populated cache.

    Skips warming when running tests or when SCFIND_ENDPOINT is unconfigured.
    Runs as a daemon thread so it never blocks startup or shutdown, and a SCFIND
    outage at boot is logged rather than fatal.
    """
    # main.py creates a module-level ``app = create_app()`` at import time, which
    # pytest also imports. Skip warming under pytest so tests never fire real
    # network requests or race on the shared module-level functools caches; the
    # test fixture's own app sets TESTING, but this import-time app does not.
    if 'pytest' in sys.modules:
        return

    scfind_endpoint = app.config.get('SCFIND_ENDPOINT')
    if (
        app.config.get('TESTING')
        or not scfind_endpoint
        or scfind_endpoint == 'should-be-overridden'
    ):
        return

    def _warm():
        with app.app_context():
            try:
                current_app.logger.info('Warming scfind cell type mapping caches...')
                # Build both maps so both endpoints serve cache hits.
                _build_label_to_clid_map()
                _build_clid_to_label_map()
                # Warm the page-independent landing payload (and the ATAC cell-type-name set the
                # landing/detail pages depend on) so the first visitor hits a warm cache.
                _get_all_cell_type_names('ATAC')
                landing = _build_cell_types_landing()
                # Warm the per-organ cell-type counts the distribution chart fetches one-per-organ;
                # they share `_cached_scfind_get`, so the chart's requests are then served warm.
                _build_cell_counts_for_tissues(landing['organs'])
                current_app.logger.info('Finished warming scfind cell type mapping caches.')
            except Exception as e:
                current_app.logger.warning(f'Failed to warm scfind caches at startup: {e}')

    threading.Thread(target=_warm, name='scfind-cache-warmer', daemon=True).start()


def _make_scfind_request(endpoint, params=None):
    """
    Helper function to make requests to the SCFIND endpoint.

    Args:
        endpoint: The API endpoint to call (e.g., 'cellTypeNames', 'CellType2CLID')
        params: Optional dictionary of parameters to include in the request

    Returns:
        JSON response from the SCFIND API
    """
    base_url = current_app.config['SCFIND_ENDPOINT']
    index_version = current_app.config['SCFIND_DEFAULT_INDEX_VERSION']

    url = f'{base_url}/api/{endpoint}'

    # Add index_version parameter
    request_params = {'index_version': index_version}
    if params:
        request_params.update(params)

    try:
        response = requests.get(url, params=request_params, timeout=EXTERNAL_REQUEST_TIMEOUT)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.Timeout as e:
        current_app.logger.error(f'Timeout making SCFIND request to {url}: {e}')
        raise
    except requests.RequestException as e:
        current_app.logger.error(f'Error making SCFIND request to {url}: {e}')
        raise


def _make_scfind_post_request(endpoint, body):
    """
    POST a JSON body to the SCFIND endpoint.

    Used for the per-operation proxy routes whose front-end hooks fall back to POST when a
    cell type name contains a comma (which would be ambiguous in a comma-joined GET param).
    The body is forwarded as-is except that ``index_version`` is injected server-side, so the
    front-end no longer needs to know or send it.
    """
    base_url = current_app.config['SCFIND_ENDPOINT']
    index_version = current_app.config['SCFIND_DEFAULT_INDEX_VERSION']

    url = f'{base_url}/api/{endpoint}'
    payload = dict(body or {})
    payload.setdefault('index_version', index_version)

    try:
        response = requests.post(url, json=payload, timeout=EXTERNAL_REQUEST_TIMEOUT)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.Timeout as e:
        current_app.logger.error(f'Timeout making SCFIND POST request to {url}: {e}')
        raise
    except requests.RequestException as e:
        current_app.logger.error(f'Error making SCFIND POST request to {url}: {e}')
        raise


def _collect_args(allowed):
    """Return the allowlisted query params present (and non-empty) in the current request."""
    return {key: request.args[key] for key in allowed if request.args.get(key)}


@lru_cache(maxsize=2048)
def _cached_scfind_get(endpoint, params_items):
    """
    Cached scfind GET keyed by ``(endpoint, sorted param items)``.

    ``params_items`` is a hashable tuple of ``(key, value)`` pairs so the result can be memoized.
    Bounded by ``maxsize`` so the long tail of arbitrary gene/cell-type queries can't grow the
    cache without limit; the cache is also reset on each server start (fresh worker processes).
    """
    params = dict(params_items)
    return _make_scfind_request(endpoint, params or None)


def _proxy_scfind_get(endpoint, allowed):
    """Forward an allowlisted GET to scfind, served from the shared cache when possible."""
    params = _collect_args(allowed)
    return _cached_scfind_get(endpoint, tuple(sorted(params.items())))


def _proxy_scfind(endpoint, allowed):
    """
    Proxy a single scfind operation, dispatching GET vs POST like the front-end hooks do.

    GET requests forward the allowlisted query params (cached). POST requests forward the JSON
    body verbatim (the comma-in-cell-type-name workaround); index_version is injected server-side.
    """
    if request.method == 'POST' and request.is_json:
        return _make_scfind_post_request(endpoint, request.get_json())
    return _proxy_scfind_get(endpoint, allowed)


@cache
def _get_all_cell_type_names(modality=None):
    """
    Fetch all cell type names from the SCFIND API.

    Args:
        modality: Optional modality filter (e.g., 'ATAC'). None for RNA (default).

    Returns:
        List of cell type names
    """
    params = {}
    if modality:
        params['modality'] = modality
    response = _make_scfind_request('cellTypeNames', params or None)
    return response.get('cellTypeNames', [])


@cache
def _get_all_genes(modality=None):
    """
    Fetch all gene names from the SCFIND API.

    Args:
        modality: Optional modality filter (e.g., 'ATAC'). None for RNA (default).

    Returns:
        List of gene names
    """
    params = {}
    if modality:
        params['modality'] = modality
    response = _make_scfind_request('scfindGenes', params or None)
    return response.get('genes', [])


@cache
def _get_label_to_clid_mapping(cell_type):
    """
    Get CLID(s) for a specific cell type label.

    Args:
        cell_type: The cell type name to look up

    Returns:
        List of CLIDs for the given cell type
    """
    response = _make_scfind_request('CellType2CLID', {'cell_type': cell_type})
    return response.get('CLIDs', [])


@cache
def _get_clid_to_label_mapping(clid):
    """
    Get cell type label(s) for a specific CLID.

    Args:
        clid: The CLID to look up

    Returns:
        List of cell type names for the given CLID
    """
    response = _make_scfind_request('CLID2CellType', {'CLID_label': clid})
    return response.get('cell_types', [])


def _build_label_to_clid_map():
    """Return the label-to-CLID map, built once and shared across worker processes."""
    return _get_or_build_map('label_to_clid', _build_label_to_clid_map_uncached)


def _build_label_to_clid_map_uncached():
    """
    Build a complete mapping from cell type labels to CLIDs using parallel requests.

    Returns:
        Dictionary mapping cell type labels to lists of CLIDs
    """
    cell_types = _get_all_cell_type_names()
    label_to_clid_map = {}

    # Get the current Flask app instance to pass to worker threads
    app = current_app._get_current_object()

    def fetch_clids_for_cell_type(cell_type):
        """Helper function to fetch CLIDs for a single cell type."""
        with app.app_context():
            try:
                clids = _get_label_to_clid_mapping(cell_type)
                return cell_type, clids
            except Exception as e:
                current_app.logger.warning(f"Failed to get CLIDs for cell type '{cell_type}': {e}")
                return cell_type, []

    # Use ThreadPoolExecutor to make parallel requests
    # Limit concurrent connections to avoid overwhelming the API
    max_workers_config = current_app.config.get('SCFIND_MAX_WORKERS', 20)
    max_workers = min(max_workers_config, len(cell_types))

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        # Submit all tasks
        future_to_cell_type = {
            executor.submit(fetch_clids_for_cell_type, cell_type): cell_type
            for cell_type in cell_types
        }

        # Collect results as they complete
        for future in as_completed(future_to_cell_type):
            cell_type, clids = future.result()
            label_to_clid_map[cell_type] = clids

    return label_to_clid_map


def _build_clid_to_label_map():
    """Return the CLID-to-label map, built once and shared across worker processes."""
    return _get_or_build_map('clid_to_label', _build_clid_to_label_map_uncached)


def _build_clid_to_label_map_uncached():
    """
    Build a complete mapping from CLIDs to cell type labels using parallel requests.

    Returns:
        Dictionary mapping CLIDs to lists of cell type labels
    """
    # First get all label-to-CLID mappings to collect all CLIDs (reuses the
    # shared label-to-CLID cache rather than rebuilding it).
    label_to_clid_map = _build_label_to_clid_map()

    # Collect all unique CLIDs
    all_clids = set()
    for clids in label_to_clid_map.values():
        all_clids.update(clids)

    # Get the current Flask app instance to pass to worker threads
    app = current_app._get_current_object()

    def fetch_labels_for_clid(clid):
        """Helper function to fetch labels for a single CLID."""
        with app.app_context():
            try:
                labels = _get_clid_to_label_mapping(clid)
                return clid, labels
            except Exception as e:
                current_app.logger.warning(f"Failed to get labels for CLID '{clid}': {e}")
                return clid, []

    # Use ThreadPoolExecutor to make parallel requests
    # Limit concurrent connections to avoid overwhelming the API
    max_workers = min(20, len(all_clids))
    clid_to_label_map = {}

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        # Submit all tasks
        future_to_clid = {executor.submit(fetch_labels_for_clid, clid): clid for clid in all_clids}

        # Collect results as they complete
        for future in as_completed(future_to_clid):
            clid, labels = future.result()
            clid_to_label_map[clid] = labels

    return clid_to_label_map


@cache
def _get_complete_mappings():
    """
    Get both label-to-CLID and CLID-to-label mappings.
    This function is cached to avoid rebuilding the mappings on every request.

    Returns:
        Tuple of (label_to_clid_map, clid_to_label_map)
    """
    start_time = time.time()
    current_app.logger.info('Starting to build complete mappings...')

    label_to_clid_map = _build_label_to_clid_map()
    mid_time = time.time()
    current_app.logger.info(
        f'Label-to-CLID mapping completed in {mid_time - start_time:.2f} seconds'
    )

    clid_to_label_map = _build_clid_to_label_map()
    end_time = time.time()
    current_app.logger.info(
        f'CLID-to-label mapping completed in {end_time - mid_time:.2f} seconds'
    )
    current_app.logger.info(f'Total mapping build time: {end_time - start_time:.2f} seconds')

    return label_to_clid_map, clid_to_label_map


# ---------------------------------------------------------------------------
# Per-page aggregate builders.
#
# Each "reworked" page (Cell Types landing, Gene detail, Cell Type detail) is served by a single
# aggregate JSON route that returns all the scfind-derived data the page needs on initial load.
# The builders compose the same cached leaf helpers the per-operation routes use (so a page visit
# warms those caches too) and fan out per-organ / per-cell-type requests with a thread pool.
# ---------------------------------------------------------------------------


def _format_cell_type_name(cell_type):
    """Strip the organ prefix from a cell type name (port of frontend formatCellTypeName)."""
    return cell_type.split('.')[1] if '.' in cell_type else cell_type


def _extract_cell_types_info(cell_types):
    """
    Derive name/organs/variants from a CLID's cell type labels.

    Python port of the frontend ``extractCellTypesInfo`` (api/scfind/utils.ts); cell type labels
    are formatted ``<organ>.<cell_type>:<variant>``.
    """
    if not cell_types:
        return {'name': '', 'organs': [], 'variants': {}}
    first = cell_types[0].split(':')[0]
    name_parts = first.split('.')
    name = name_parts[1] if len(name_parts) > 1 else name_parts[0]
    organs = []
    variants = {}
    for cell_type in cell_types:
        organ = cell_type.split('.')[0]
        type_with_variant = cell_type.split('.')[1] if '.' in cell_type else ''
        variant = type_with_variant.split(':')[1] if ':' in type_with_variant else None
        if organ not in organs:
            organs.append(organ)
        variants.setdefault(organ, [])
        if variant and variant not in variants[organ]:
            variants[organ].append(variant)
    return {'name': name, 'organs': organs, 'variants': variants}


def _fan_out(items, fetch_one, label):
    """
    Run ``fetch_one(item)`` for each item across a bounded thread pool, returning ``{item: result}``.

    Each task re-enters the app context (worker threads don't inherit it); a per-item failure is
    logged and the item is dropped from the result rather than failing the whole aggregate.
    """
    if not items:
        return {}
    app = current_app._get_current_object()

    def run(item):
        with app.app_context():
            try:
                return item, fetch_one(item)
            except Exception as e:
                current_app.logger.warning(f'{label} failed for {item!r}: {e}')
                return item, None

    max_workers = min(current_app.config.get('SCFIND_MAX_WORKERS', 20), len(items))
    results = {}
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = [executor.submit(run, item) for item in items]
        for future in as_completed(futures):
            item, result = future.result()
            if result is not None:
                results[item] = result
    return results


def _build_cell_counts_for_tissues(organs, modality=None):
    """Per-organ cellTypeCountForTissue counts (RNA by default), keyed by organ."""

    def fetch(organ):
        params = {'tissue': organ}
        if modality:
            params['modality'] = modality
        response = _cached_scfind_get('cellTypeCountForTissue', tuple(sorted(params.items())))
        return response.get('cellTypeCounts', [])

    return _fan_out(organs, fetch, 'cellTypeCountForTissue')


def _build_datasets_for_cell_types(cell_types):
    """Per-cell-type findDatasetForCellType payloads ({counts, datasets}), keyed by cell type."""

    def fetch(cell_type):
        # Comma-containing labels are ambiguous in a GET param, so POST the body (as the hook does).
        if ',' in cell_type:
            return _make_scfind_post_request('findDatasetForCellType', {'cell_type': cell_type})
        return _cached_scfind_get('findDatasetForCellType', (('cell_type', cell_type),))

    return _fan_out(cell_types, fetch, 'findDatasetForCellType')


def _cell_type_markers_for(cell_types):
    """Marker genes for a set of cell type labels (GET, or POST when a label contains a comma)."""
    if not cell_types:
        return {}
    if any(',' in cell_type for cell_type in cell_types):
        return _make_scfind_post_request(
            'cellTypeMarkers',
            {
                'cell_types': list(cell_types),
                'top_k': 10,
                'sort_field': 'f1',
                'include_prefix': True,
            },
        )
    params = {
        'cell_types': ','.join(cell_types),
        'top_k': '10',
        'sort_field': 'f1',
        'include_prefix': 'true',
    }
    return _cached_scfind_get('cellTypeMarkers', tuple(sorted(params.items())))


def _build_cell_types_landing_uncached():
    """Assemble the Cell Types landing payload from the cached cell-type-name lists.

    The distribution chart's per-organ counts are intentionally NOT bundled here: the chart fetches
    them via the `/scfind/cell-type-count-for-tissue.json` route, which shares the same
    `_cached_scfind_get` cache the warmer populates (see `warm_scfind_caches`), so those requests
    are served warm without bloating this payload.
    """
    rna = [ct for ct in _get_all_cell_type_names() if _format_cell_type_name(ct) != 'other']
    atac = [ct for ct in _get_all_cell_type_names('ATAC') if _format_cell_type_name(ct) != 'other']
    organs = []
    for cell_type in rna:
        organ = cell_type.split('.')[0]
        if organ not in organs:
            organs.append(organ)
    return {
        'cell_type_names': rna,
        'cell_type_names_atac': atac,
        'organs': organs,
    }


def _build_cell_types_landing():
    """Cell Types landing payload, built once and shared across worker processes (disk-cached)."""
    return _get_or_build_map('cell_types_landing', _build_cell_types_landing_uncached)


def _build_gene_detail(gene_symbol):
    """Assemble the Gene detail payload (hyperQuery + findDatasets + label->CLID subset)."""
    hyper_query = _cached_scfind_get(
        'hyperQueryCellTypes', (('gene_list', gene_symbol), ('include_prefix', 'true'))
    ).get('findGeneSignatures', [])
    find_datasets = _cached_scfind_get('findDatasets', (('gene_list', gene_symbol),))
    cell_types = [
        sig['cell_type'] for sig in hyper_query if isinstance(sig, dict) and sig.get('cell_type')
    ]
    organs = sorted({ct.split('.')[0] for ct in cell_types if '.' in ct})
    label_to_clid_map = _build_label_to_clid_map()
    label_to_clid = {ct: label_to_clid_map.get(ct, []) for ct in cell_types}
    return {
        'hyper_query': hyper_query,
        'find_datasets': find_datasets,
        'organs': organs,
        'label_to_clid': label_to_clid,
    }


def _build_cell_type_detail(clid):
    """
    Assemble the Cell Type detail payload: the CLID's cell type labels (+ derived name/organs/
    variants), marker genes, and the datasets containing each cell type.

    The distribution chart's per-organ counts and ATAC-availability check are intentionally NOT
    bundled here — they're served by the per-operation routes that share the warmed
    `_cached_scfind_get` / cellTypeNames caches (see `warm_scfind_caches`).
    """
    clid_to_label_map = _build_clid_to_label_map()
    cell_types = clid_to_label_map.get(clid, [])
    info = _extract_cell_types_info(cell_types)
    return {
        'cell_types': cell_types,
        'name': info['name'],
        'organs': info['organs'],
        'variants': info['variants'],
        'markers': _cell_type_markers_for(cell_types).get('findGeneSignatures', []),
        'datasets_for_cell_types': _build_datasets_for_cell_types(cell_types),
    }


@blueprint.route('/scfind/label-to-clid-map.json')
def label_to_clid_map():
    """
    Endpoint that returns a mapping from cell type labels to CLIDs.

    Returns:
        JSON object mapping cell type labels to lists of CLIDs
    """
    try:
        # Build only the label-to-CLID map: the frontend fetches this map and the
        # CLID-to-label map via separate hooks on different pages, so there is no
        # reason to pay the cost of building the CLID-to-label map here.
        return jsonify(_build_label_to_clid_map())
    except Exception as e:
        return _handle_scfind_error(e, 'label-to-CLID map')


@blueprint.route('/scfind/clid-to-label-map.json')
def clid_to_label_map():
    """
    Endpoint that returns a mapping from CLIDs to cell type labels.

    Returns:
        JSON object mapping CLIDs to lists of cell type labels
    """
    try:
        # Build only the CLID-to-label map. It internally reuses the cached
        # label-to-CLID map (see _build_clid_to_label_map), so correctness is
        # unchanged while we avoid coupling this to the other endpoint.
        return jsonify(_build_clid_to_label_map())
    except Exception as e:
        return _handle_scfind_error(e, 'CLID-to-label map')


@blueprint.route('/scfind/combined-maps.json')
def combined_maps():
    """
    Endpoint that returns both mappings in a single response.

    Returns:
        JSON object with both 'label_to_clid' and 'clid_to_label' mappings
    """
    try:
        label_to_clid_map, clid_to_label_map = _get_complete_mappings()
        return jsonify({'label_to_clid': label_to_clid_map, 'clid_to_label': clid_to_label_map})
    except Exception as e:
        return _handle_scfind_error(e, 'combined maps')


@blueprint.route('/scfind/cell-type-names.json')
def cell_type_names():
    """
    Endpoint that returns all available cell type names.

    Query parameters:
        modality: Optional modality filter (e.g., 'ATAC')

    Returns:
        JSON object with a list of cell type names
    """
    try:
        modality = request.args.get('modality')
        cell_types = _get_all_cell_type_names(modality)
        return jsonify({'cell_types': cell_types})
    except Exception as e:
        return _handle_scfind_error(e, 'cell type names')


@blueprint.route('/scfind/genes.json')
def genes():
    """
    Endpoint that returns all available gene names.

    Query parameters:
        modality: Optional modality filter (e.g., 'ATAC')

    Returns:
        JSON object with a list of gene names
    """
    try:
        modality = request.args.get('modality')
        gene_list = _get_all_genes(modality)
        return jsonify({'genes': gene_list})
    except Exception as e:
        return _handle_scfind_error(e, 'gene names')


@blueprint.route('/scfind/genes/autocomplete')
def genes_autocomplete():
    """
    Endpoint for gene name autocomplete/search.

    Query parameters:
        q: Search query string
        limit: Maximum number of results to return (default: 10)
        modality: Optional modality filter (e.g., 'ATAC')

    Returns:
        JSON object with formatted gene matches using highlighting
    """
    try:
        query = request.args.get('q', '').strip()
        limit = min(int(request.args.get('limit', 10)), 100)  # Cap at 100 results
        modality = request.args.get('modality')

        if not query:
            return jsonify({'results': []})

        all_genes = _get_all_genes(modality)

        results = first_n_matches(all_genes, query, limit)

        return jsonify({'results': results})
    except Exception as e:
        return _handle_scfind_error(e, 'gene autocomplete')


@blueprint.route('/scfind/cell-types/autocomplete')
def cell_types_autocomplete():
    """
    Endpoint for cell type name autocomplete/search.

    Query parameters:
        q: Search query string
        limit: Maximum number of results to return (default: 10)
        modality: Optional modality filter (e.g., 'ATAC')

    Returns:
        JSON object with formatted cell type matches using highlighting.
        Cell type names have organ prefixes removed and organs are included as tags.
    """
    try:
        query = request.args.get('q', '').strip()
        limit = min(int(request.args.get('limit', 10)), 100)  # Cap at 100 results
        modality = request.args.get('modality')

        if not query:
            return jsonify({'results': []})

        all_cell_types = _get_all_cell_type_names(modality)

        # Group cell types by base name (without organ prefix) and collect organs
        cell_type_map = {}
        for full_name in all_cell_types:
            if '.' in full_name:
                organ, cell_type = full_name.split('.', 1)
                if cell_type not in cell_type_map:
                    cell_type_map[cell_type] = set()
                cell_type_map[cell_type].add(organ)
            else:
                # Handle case where there's no organ prefix
                if full_name not in cell_type_map:
                    cell_type_map[full_name] = set()

        # Filter cell types that match the query and format results
        matching_results = []
        for cell_type, organs in cell_type_map.items():
            if query.lower() in cell_type.lower():
                organs_list = sorted(list(organs))  # Convert set to sorted list

                # Find the match position for highlighting
                match_index = cell_type.lower().find(query.lower())
                pre = cell_type[:match_index]
                match = cell_type[match_index : match_index + len(query)]
                post = cell_type[match_index + len(query) :]

                matching_results.append(
                    {
                        'full': cell_type,
                        'pre': pre,
                        'match': match,
                        'post': post,
                        'tags': organs_list,  # Organs as tags for chip display
                        'organs': organs_list,  # Additional field for organs
                        'values': [
                            f'{organ}.{cell_type}' for organ in organs_list
                        ],  # Original names
                    }
                )

        # Sort by relevance: exact matches first, then starts-with, then contains
        def sort_key(result):
            cell_type_lower = result['full'].lower()
            query_lower = query.lower()
            if cell_type_lower == query_lower:
                return (0, result['full'])  # Exact match
            elif cell_type_lower.startswith(query_lower):
                return (1, result['full'])  # Starts with query
            else:
                return (2, result['full'])  # Contains query

        matching_results.sort(key=sort_key)

        # Limit results
        limited_results = matching_results[:limit]

        return jsonify({'results': limited_results})
    except Exception as e:
        return _handle_scfind_error(e, 'cell type autocomplete')


@blueprint.route('/scfind/genes/validate', methods=['POST'])
def genes_validate():
    """
    Endpoint to validate which genes from a provided list exist in SCFIND.

    Expects JSON body:
        {
            "genes": ["GENE1", "GENE2", ...],
            "modality": "ATAC" (optional)
        }

    Returns:
        JSON object with validation results:
        {
            "valid_genes": ["GENE1", ...],
            "invalid_genes": ["UNKNOWN_GENE", ...],
            "total_provided": 10,
            "total_valid": 8
        }
    """
    try:
        if not request.is_json:
            return jsonify({'error': 'Request must be JSON'}), 400

        data = request.get_json()
        if not data or 'genes' not in data:
            return jsonify({'error': 'Missing "genes" array in request body'}), 400

        provided_genes = data['genes']
        if not isinstance(provided_genes, list):
            return jsonify({'error': '"genes" must be an array'}), 400

        modality = data.get('modality')

        # Get all valid genes from SCFIND
        all_genes = _get_all_genes(modality)
        all_genes_set = set(all_genes)

        # Validate provided genes
        valid_genes = []
        invalid_genes = []

        for gene in provided_genes:
            if isinstance(gene, str) and gene in all_genes_set:
                valid_genes.append(gene)
            else:
                invalid_genes.append(gene)

        return jsonify(
            {
                'valid_genes': valid_genes,
                'invalid_genes': invalid_genes,
                'total_provided': len(provided_genes),
                'total_valid': len(valid_genes),
            }
        )
    except Exception as e:
        return _handle_scfind_error(e, 'gene validation')


@blueprint.route('/scfind/pathway-genes', methods=['POST'])
def pathway_genes():
    """
    Endpoint to fetch pathway genes from UBKG and validate them against the scFind gene list.

    Expects JSON body:
        {
            "pathway_code": "R-HSA-12345",
            "modality": "ATAC" (optional)
        }

    Returns:
        JSON object with validated pathway genes:
        {
            "valid_genes": ["GENE1", ...],
            "invalid_genes": ["GENE2", ...],
            "total_genes": 50,
            "total_valid": 42
        }
    """
    try:
        data, error = parse_pathway_genes_request()
        if error:
            return jsonify(error), 400

        # Validate against the scFind gene list for the given modality.
        modality = data.get('modality')
        return jsonify(
            validate_pathway_genes(data['pathway_code'], lambda: _get_all_genes(modality))
        )
    except Exception as e:
        return _handle_scfind_error(e, 'pathway gene validation')


# ---------------------------------------------------------------------------
# Per-operation proxy routes.
#
# Each of these mirrors a single scFind API operation that the front-end used to call directly
# from the browser. They forward an allowlisted set of params (or, for the comma-cell-type-name
# cases, a POSTed JSON body) to scFind via the shared `_proxy_scfind*` helpers, inject
# index_version server-side, cache GET responses, and return scFind's response shape unchanged so
# the consuming hooks need no response-type changes. `jsonify(...)` is kept lexically at each
# route's return so request-derived data is served as application/json (not an HTML/XSS sink).
# ---------------------------------------------------------------------------


@blueprint.route('/scfind/hyper-query-cell-types.json')
def hyper_query_cell_types():
    """Cell types whose marker genes are enriched for the queried gene(s)."""
    try:
        return jsonify(
            _proxy_scfind_get(
                'hyperQueryCellTypes', ('gene_list', 'dataset_name', 'include_prefix', 'modality')
            )
        )
    except Exception as e:
        return _handle_scfind_error(e, 'hyperQueryCellTypes')


@blueprint.route('/scfind/find-datasets.json')
def find_datasets():
    """Datasets containing the queried gene(s), with per-dataset cell counts."""
    try:
        return jsonify(_proxy_scfind_get('findDatasets', ('gene_list', 'modality')))
    except Exception as e:
        return _handle_scfind_error(e, 'findDatasets')


@blueprint.route('/scfind/find-dataset-for-cell-type.json', methods=['GET', 'POST'])
def find_dataset_for_cell_type():
    """Datasets containing the queried cell type, with per-dataset cell counts."""
    try:
        return jsonify(_proxy_scfind('findDatasetForCellType', ('cell_type', 'modality')))
    except Exception as e:
        return _handle_scfind_error(e, 'findDatasetForCellType')


@blueprint.route('/scfind/cell-type-count-for-dataset.json')
def cell_type_count_for_dataset():
    """Cell type composition (counts) of a single dataset."""
    try:
        return jsonify(_proxy_scfind_get('cellTypeCountForDataset', ('dataset', 'modality')))
    except Exception as e:
        return _handle_scfind_error(e, 'cellTypeCountForDataset')


@blueprint.route('/scfind/cell-type-count-for-tissue.json')
def cell_type_count_for_tissue():
    """Cell type composition (counts) of a single tissue/organ."""
    try:
        return jsonify(_proxy_scfind_get('cellTypeCountForTissue', ('tissue', 'modality')))
    except Exception as e:
        return _handle_scfind_error(e, 'cellTypeCountForTissue')


@blueprint.route('/scfind/cell-type-expression.json')
def cell_type_expression():
    """Expression of the queried gene(s) within a cell type (dataset-scoped)."""
    try:
        return jsonify(
            _proxy_scfind_get('getCellTypeExpression', ('gene_list', 'cell_type', 'modality'))
        )
    except Exception as e:
        return _handle_scfind_error(e, 'getCellTypeExpression')


@blueprint.route('/scfind/cell-type-expression-bins.json')
def cell_type_expression_bins():
    """Binned expression of the queried gene(s) within a cell type (dataset-scoped)."""
    try:
        return jsonify(
            _proxy_scfind_get(
                'getCellTypeExpressionBinData',
                ('gene_list', 'cell_type', 'bin_length', 'modality'),
            )
        )
    except Exception as e:
        return _handle_scfind_error(e, 'getCellTypeExpressionBinData')


@blueprint.route('/scfind/cell-type-markers.json', methods=['GET', 'POST'])
def cell_type_markers():
    """Marker genes for the queried cell type(s), optionally against a background set."""
    try:
        return jsonify(
            _proxy_scfind(
                'cellTypeMarkers',
                (
                    'cell_types',
                    'background_cell_types',
                    'top_k',
                    'sort_field',
                    'include_prefix',
                    'modality',
                ),
            )
        )
    except Exception as e:
        return _handle_scfind_error(e, 'cellTypeMarkers')


@blueprint.route('/scfind/evaluate-markers.json', methods=['GET', 'POST'])
def evaluate_markers():
    """Evaluate the queried gene signature against the queried cell type(s)."""
    try:
        return jsonify(
            _proxy_scfind(
                'evaluateMarkers',
                (
                    'gene_list',
                    'cell_types',
                    'background_cell_types',
                    'sort_field',
                    'include_prefix',
                ),
            )
        )
    except Exception as e:
        return _handle_scfind_error(e, 'evaluateMarkers')


@blueprint.route('/scfind/find-gene-signatures.json', methods=['GET', 'POST'])
def find_gene_signatures():
    """Discriminating gene signatures for the queried cell type(s)."""
    try:
        return jsonify(
            _proxy_scfind('findGeneSignatures', ('cell_types', 'min_cells', 'min_fraction'))
        )
    except Exception as e:
        return _handle_scfind_error(e, 'findGeneSignatures')


@blueprint.route('/scfind/find-similar-genes.json')
def find_similar_genes():
    """Genes with expression patterns similar to the queried gene(s) in a dataset."""
    try:
        return jsonify(
            _proxy_scfind_get('findSimilarGenes', ('gene_list', 'dataset_name', 'top_k'))
        )
    except Exception as e:
        return _handle_scfind_error(e, 'findSimilarGenes')


@blueprint.route('/scfind/marker-genes.json')
def marker_genes():
    """Cell types associated with the queried marker gene(s)."""
    try:
        return jsonify(_proxy_scfind_get('marker_genes', ('marker_genes', 'dataset_name')))
    except Exception as e:
        return _handle_scfind_error(e, 'marker_genes')


@blueprint.route('/scfind/find-housekeeping-genes.json', methods=['GET', 'POST'])
def find_housekeeping_genes():
    """Housekeeping genes shared across the queried cell type(s)."""
    try:
        return jsonify(
            _proxy_scfind('findHouseKeepingGenes', ('cell_types', 'min_recall', 'max_genes'))
        )
    except Exception as e:
        return _handle_scfind_error(e, 'findHouseKeepingGenes')


@blueprint.route('/scfind/find-cell-type-specificities.json')
def find_cell_type_specificities():
    """Cell type specificity scores for the queried gene(s)."""
    try:
        return jsonify(
            _proxy_scfind_get(
                'findCellTypeSpecificities',
                ('gene_list', 'datasets', 'min_cells', 'min_fraction'),
            )
        )
    except Exception as e:
        return _handle_scfind_error(e, 'findCellTypeSpecificities')


@blueprint.route('/scfind/find-tissue-specificities.json')
def find_tissue_specificities():
    """Tissue specificity scores for the queried gene(s)."""
    try:
        return jsonify(_proxy_scfind_get('findTissueSpecificities', ('gene_list', 'min_cells')))
    except Exception as e:
        return _handle_scfind_error(e, 'findTissueSpecificities')


@blueprint.route('/scfind/indexed-datasets.json')
def indexed_datasets():
    """All datasets indexed by scFind, with per-dataset cell counts."""
    try:
        return jsonify(_proxy_scfind_get('getDatasets', ('modality',)))
    except Exception as e:
        return _handle_scfind_error(e, 'getDatasets')


# ---------------------------------------------------------------------------
# Per-page aggregate routes (see the builders above). One request returns all the scfind data a
# reworked page needs on initial load. `jsonify(...)` is kept lexically at each return, and the
# user-supplied path params are validated at the boundary before reaching scfind.
# ---------------------------------------------------------------------------


@blueprint.route('/scfind/cell-types-landing.json')
def cell_types_landing():
    """Aggregate scfind data for the Cell Types landing page (cached + warmed at startup)."""
    try:
        return jsonify(_build_cell_types_landing())
    except Exception as e:
        return _handle_scfind_error(e, 'cell types landing')


@blueprint.route('/scfind/gene-detail/<gene_symbol>.json')
def gene_detail(gene_symbol):
    """Aggregate scfind data for the Gene detail page."""
    try:
        if not is_valid_gene_symbol(gene_symbol):
            return jsonify({'error': 'Invalid gene symbol.'}), 400
        return jsonify(_build_gene_detail(gene_symbol))
    except Exception as e:
        return _handle_scfind_error(e, 'gene detail')


@blueprint.route('/scfind/cell-type-detail/<clid>.json')
def cell_type_detail(clid):
    """Aggregate scfind data for the Cell Type detail page."""
    try:
        if not is_valid_clid(clid):
            return jsonify({'error': 'Invalid cell type ID.'}), 400
        return jsonify(_build_cell_type_detail(clid))
    except Exception as e:
        return _handle_scfind_error(e, 'cell type detail')
