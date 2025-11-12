from functools import cache
import requests
from flask import current_app, jsonify, request
from concurrent.futures import ThreadPoolExecutor, as_completed

from .utils import first_n_matches, make_blueprint


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

    url = f'{base_url}/api/{endpoint}'

    # Add index_version parameter
    request_params = {'index_version': index_version}
    if params:
        request_params.update(params)

    try:
        response = requests.get(url, params=request_params)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        current_app.logger.error(f'Error making SCFIND request to {url}: {e}')
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
def _get_all_genes():
    """
    Fetch all gene names from the SCFIND API.

    Returns:
        List of gene names
    """
    response = _make_scfind_request('scfindGenes')
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
    import time

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
        current_app.logger.error(f'Error building label-to-CLID map: {e}')
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
        current_app.logger.error(f'Error building CLID-to-label map: {e}')
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
        return jsonify({'label_to_clid': label_to_clid_map, 'clid_to_label': clid_to_label_map})
    except Exception as e:
        current_app.logger.error(f'Error building combined maps: {e}')
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
        current_app.logger.error(f'Error fetching cell type names: {e}')
        return jsonify({'error': 'Failed to fetch cell type names'}), 500


@blueprint.route('/scfind/genes.json')
def genes():
    """
    Endpoint that returns all available gene names.

    Returns:
        JSON object with a list of gene names
    """
    try:
        gene_list = _get_all_genes()
        return jsonify({'genes': gene_list})
    except Exception as e:
        current_app.logger.error(f'Error fetching gene names: {e}')
        return jsonify({'error': 'Failed to fetch gene names'}), 500


@blueprint.route('/scfind/genes/autocomplete')
def genes_autocomplete():
    """
    Endpoint for gene name autocomplete/search.

    Query parameters:
        q: Search query string
        limit: Maximum number of results to return (default: 10)

    Returns:
        JSON object with formatted gene matches using highlighting
    """
    try:
        query = request.args.get('q', '').strip()
        limit = min(int(request.args.get('limit', 10)), 100)  # Cap at 100 results

        if not query:
            return jsonify({'results': []})

        all_genes = _get_all_genes()

        results = first_n_matches(all_genes, query, limit)

        return jsonify({'results': results})
    except Exception as e:
        current_app.logger.error(f'Error in gene autocomplete: {e}')
        return jsonify({'error': 'Failed to search genes'}), 500


@blueprint.route('/scfind/cell-types/autocomplete')
def cell_types_autocomplete():
    """
    Endpoint for cell type name autocomplete/search.

    Query parameters:
        q: Search query string
        limit: Maximum number of results to return (default: 10)

    Returns:
        JSON object with formatted cell type matches using highlighting.
        Cell type names have organ prefixes removed and organs are included as tags.
    """
    try:
        query = request.args.get('q', '').strip()
        limit = min(int(request.args.get('limit', 10)), 100)  # Cap at 100 results

        if not query:
            return jsonify({'results': []})

        all_cell_types = _get_all_cell_type_names()

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
        current_app.logger.error(f'Error in cell type autocomplete: {e}')
        return jsonify({'error': 'Failed to search cell types'}), 500


@blueprint.route('/scfind/genes/validate', methods=['POST'])
def genes_validate():
    """
    Endpoint to validate which genes from a provided list exist in SCFIND.

    Expects JSON body:
        {
            "genes": ["GENE1", "GENE2", ...]
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

        # Get all valid genes from SCFIND
        all_genes = _get_all_genes()
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
        current_app.logger.error(f'Error in gene validation: {e}')
        return jsonify({'error': 'Failed to validate genes'}), 500
