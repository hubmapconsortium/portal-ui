from functools import cache
import requests
from flask import current_app, jsonify
from concurrent.futures import ThreadPoolExecutor, as_completed

from .utils import make_blueprint


blueprint = make_blueprint(__name__)


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

    url = f"{base_url}/api/{endpoint}"

    # Add index_version parameter
    request_params = {'index_version': index_version}
    if params:
        request_params.update(params)

    try:
        response = requests.get(url, params=request_params)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        current_app.logger.error(f"Error making SCFIND request to {url}: {e}")
        raise


@cache
def _get_all_cell_type_names():
    """
    Fetch all cell type names from the SCFIND API.

    Returns:
        List of cell type names
    """
    response = _make_scfind_request('cellTypeNames')
    return response.get('cellTypeNames', [])


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


@cache
def _build_label_to_clid_map():
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
    max_workers = min(20, len(cell_types))

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


@cache
def _build_clid_to_label_map():
    """
    Build a complete mapping from CLIDs to cell type labels using parallel requests.

    Returns:
        Dictionary mapping CLIDs to lists of cell type labels
    """
    # First get all label-to-CLID mappings to collect all CLIDs
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
        future_to_clid = {
            executor.submit(fetch_labels_for_clid, clid): clid
            for clid in all_clids
        }

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
    import time
    start_time = time.time()
    current_app.logger.info("Starting to build complete mappings...")

    label_to_clid_map = _build_label_to_clid_map()
    mid_time = time.time()
    current_app.logger.info(
        f"Label-to-CLID mapping completed in {mid_time - start_time:.2f} seconds"
    )

    clid_to_label_map = _build_clid_to_label_map()
    end_time = time.time()
    current_app.logger.info(
        f"CLID-to-label mapping completed in {end_time - mid_time:.2f} seconds"
    )
    current_app.logger.info(f"Total mapping build time: {end_time - start_time:.2f} seconds")

    return label_to_clid_map, clid_to_label_map


@blueprint.route('/scfind/label-to-clid-map.json')
def label_to_clid_map():
    """
    Endpoint that returns a mapping from cell type labels to CLIDs.

    Returns:
        JSON object mapping cell type labels to lists of CLIDs
    """
    try:
        label_to_clid_map, _ = _get_complete_mappings()
        return jsonify(label_to_clid_map)
    except Exception as e:
        current_app.logger.error(f"Error building label-to-CLID map: {e}")
        return jsonify({'error': 'Failed to build label-to-CLID mapping'}), 500


@blueprint.route('/scfind/clid-to-label-map.json')
def clid_to_label_map():
    """
    Endpoint that returns a mapping from CLIDs to cell type labels.

    Returns:
        JSON object mapping CLIDs to lists of cell type labels
    """
    try:
        _, clid_to_label_map = _get_complete_mappings()
        return jsonify(clid_to_label_map)
    except Exception as e:
        current_app.logger.error(f"Error building CLID-to-label map: {e}")
        return jsonify({'error': 'Failed to build CLID-to-label mapping'}), 500


@blueprint.route('/scfind/combined-maps.json')
def combined_maps():
    """
    Endpoint that returns both mappings in a single response.

    Returns:
        JSON object with both 'label_to_clid' and 'clid_to_label' mappings
    """
    try:
        label_to_clid_map, clid_to_label_map = _get_complete_mappings()
        return jsonify({
            'label_to_clid': label_to_clid_map,
            'clid_to_label': clid_to_label_map
        })
    except Exception as e:
        current_app.logger.error(f"Error building combined maps: {e}")
        return jsonify({'error': 'Failed to build mappings'}), 500


@blueprint.route('/scfind/cell-type-names.json')
def cell_type_names():
    """
    Endpoint that returns all available cell type names.

    Returns:
        JSON object with a list of cell type names
    """
    try:
        cell_types = _get_all_cell_type_names()
        return jsonify({'cell_types': cell_types})
    except Exception as e:
        current_app.logger.error(f"Error fetching cell type names: {e}")
        return jsonify({'error': 'Failed to fetch cell type names'}), 500
