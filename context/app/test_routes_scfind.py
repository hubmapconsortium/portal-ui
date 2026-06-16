import os
import time

import pytest
import requests

from .main import create_app
from . import routes_scfind
from . import utils as app_utils


@pytest.fixture
def client(tmp_path):
    app = create_app(testing=True)
    # Set mock config values for SCFIND
    app.config['SCFIND_ENDPOINT'] = 'https://mock.scfind.api'
    app.config['SCFIND_DEFAULT_INDEX_VERSION'] = 'v1.0'
    app.config['SCFIND_MAX_WORKERS'] = 2  # Low value for tests
    app.config['UBKG_ENDPOINT'] = 'https://mock.ubkg.api'
    # Isolate the cross-process map cache to a per-test temp dir, and clear the
    # in-process memo so maps don't leak between tests (the builders are no
    # longer @cache-decorated; they use the disk-backed cache instead).
    app.config['SCFIND_CACHE_DIR'] = str(tmp_path)
    routes_scfind._memory_cache.clear()
    with app.test_client() as client:
        # Clear any cached data before each test
        if hasattr(routes_scfind._get_all_cell_type_names, 'cache_clear'):
            routes_scfind._get_all_cell_type_names.cache_clear()
        if hasattr(routes_scfind._get_all_genes, 'cache_clear'):
            routes_scfind._get_all_genes.cache_clear()
        if hasattr(routes_scfind._cached_scfind_get, 'cache_clear'):
            routes_scfind._cached_scfind_get.cache_clear()
        if hasattr(routes_scfind._get_label_to_clid_mapping, 'cache_clear'):
            routes_scfind._get_label_to_clid_mapping.cache_clear()
        if hasattr(routes_scfind._get_clid_to_label_mapping, 'cache_clear'):
            routes_scfind._get_clid_to_label_mapping.cache_clear()
        if hasattr(routes_scfind._build_label_to_clid_map, 'cache_clear'):
            routes_scfind._build_label_to_clid_map.cache_clear()
        if hasattr(routes_scfind._build_clid_to_label_map, 'cache_clear'):
            routes_scfind._build_clid_to_label_map.cache_clear()
        if hasattr(routes_scfind._get_complete_mappings, 'cache_clear'):
            routes_scfind._get_complete_mappings.cache_clear()
        if hasattr(app_utils.fetch_pathway_participants, 'cache_clear'):
            app_utils.fetch_pathway_participants.cache_clear()
        yield client


# Mock data for various SCFIND responses
mock_cell_type_names = {
    'cellTypeNames': [
        'kidney.epithelial cell',
        'kidney.mesenchymal cell',
        'heart.cardiomyocyte',
        'heart.endothelial cell',
        'lung.alveolar epithelial cell',
        'lung.macrophage',
    ]
}

mock_atac_cell_type_names = {
    'cellTypeNames': [
        'kidney.epithelial cell',
        'heart.cardiomyocyte',
        'lung.macrophage',
    ]
}

mock_gene_names = {'genes': ['ACTB', 'GAPDH', 'TP53', 'MYC', 'EGFR', 'BRCA1', 'BRCA2']}

mock_atac_gene_names = {'genes': ['ACTB', 'TP53', 'EGFR']}

mock_ubkg_pathway_response = {
    'events': [
        {
            'sabs': [
                {
                    'SAB': 'HGNC',
                    'participants': [
                        {'symbol': 'ACTB'},
                        {'symbol': 'TP53'},
                        {'symbol': 'INVALID_GENE'},
                    ],
                }
            ]
        },
        {
            'sabs': [
                {
                    'SAB': 'OTHER',
                    'participants': [{'symbol': 'SHOULD_NOT_APPEAR'}],
                }
            ]
        },
    ]
}

mock_label_to_clid = {'CLIDs': ['CL:0000066', 'CL:0000067']}

mock_clid_to_label = {'cell_types': ['epithelial cell', 'mesenchymal cell']}

# Native scfind response shapes for the per-operation proxy routes. The routes forward these
# unchanged, so the consuming front-end hooks keep their existing response types.
mock_hyper_query = {
    'findGeneSignatures': [
        {'cell_type': 'kidney.epithelial cell', 'cell_hits': 12, 'total_cells': 40},
    ]
}
mock_find_datasets = {
    'counts': {'VIM': [3, 7]},
    'findDatasets': {'VIM': ['HBM123.ABCD.456', 'HBM789.EFGH.012']},
}
mock_find_dataset_for_cell_type = {'counts': [2], 'datasets': ['HBM123.ABCD.456']}
mock_cell_type_count_for_dataset = {'cellTypeCounts': [{'count': 5, 'index': 'epithelial cell'}]}
mock_cell_type_count_for_tissue = {
    'cellTypeCounts': [{'cell_count': 9, 'index': 'kidney.epithelial cell'}]
}
mock_cell_type_expression = {'VIM': {'0-1': 238, '1-2': 57}}
mock_cell_type_markers = {
    'findGeneSignatures': [{'cellType': 'kidney.epithelial cell', 'genes': 'VIM'}]
}
mock_evaluate_markers = {'evaluateMarkers': [{'gene': 'VIM', 'precision': 0.9}]}
mock_find_gene_signatures = {'evaluateMarkers': [{'gene': 'VIM'}]}
mock_find_similar_genes = {'evaluateMarkers': [{'gene': 'ACTB'}]}
mock_marker_genes = [{'cell_type': 'kidney.epithelial cell'}]
mock_find_housekeeping_genes = {'findHouseKeepingGenes': ['ACTB', 'GAPDH']}
mock_find_cell_type_specificities = {
    'cellTypeSpecificities': [{'cell_type': 'kidney.epithelial cell'}]
}
mock_find_tissue_specificities = {'evaluateMarkers': [{'tissue': 'kidney'}]}
mock_indexed_datasets = {'datasets': ['HBM123.ABCD.456'], 'counts': [42]}

# UBKG /celltypes response: Cell Ontology definitions keyed (in the response) by full CLID.
mock_celltypes = [
    {
        'cell_type': {
            'id': 'CL:0000066',
            'definition': 'A mock epithelial cell definition.',
            'name': 'epithelial cell',
        }
    },
    {
        'cell_type': {
            'id': 'CL:0000067',
            'definition': 'A mock ciliated cell definition.',
            'name': 'ciliated cell',
        }
    },
]


def _scfind_response_for_url(url, has_atac_modality):
    """Return the mock scfind payload for a given request URL, or None if unmatched.

    Ordering matters where one endpoint name is a prefix of another (e.g.
    getCellTypeExpressionBinData vs getCellTypeExpression).
    """
    if 'cellTypeNames' in url:
        return mock_atac_cell_type_names if has_atac_modality else mock_cell_type_names
    elif 'scfindGenes' in url:
        return mock_atac_gene_names if has_atac_modality else mock_gene_names
    elif 'CellType2CLID' in url:
        return mock_label_to_clid
    elif 'CLID2CellType' in url:
        return mock_clid_to_label
    elif 'pathways' in url and 'participants' in url:
        return mock_ubkg_pathway_response
    elif 'celltypes' in url:
        return mock_celltypes
    elif 'hyperQueryCellTypes' in url:
        return mock_hyper_query
    elif 'findDatasetForCellType' in url:
        return mock_find_dataset_for_cell_type
    elif 'findDatasets' in url:
        return mock_find_datasets
    elif 'cellTypeCountForDataset' in url:
        return mock_cell_type_count_for_dataset
    elif 'cellTypeCountForTissue' in url:
        return mock_cell_type_count_for_tissue
    elif 'getCellTypeExpressionBinData' in url:
        return mock_cell_type_expression
    elif 'getCellTypeExpression' in url:
        return mock_cell_type_expression
    elif 'cellTypeMarkers' in url:
        return mock_cell_type_markers
    elif 'evaluateMarkers' in url:
        return mock_evaluate_markers
    elif 'findGeneSignatures' in url:
        return mock_find_gene_signatures
    elif 'findSimilarGenes' in url:
        return mock_find_similar_genes
    elif 'marker_genes' in url:
        return mock_marker_genes
    elif 'findHouseKeepingGenes' in url:
        return mock_find_housekeeping_genes
    elif 'findCellTypeSpecificities' in url:
        return mock_find_cell_type_specificities
    elif 'findTissueSpecificities' in url:
        return mock_find_tissue_specificities
    elif 'getDatasets' in url:
        return mock_indexed_datasets
    return None


class _MockResponse:
    def __init__(self, json_data, status_code=200):
        self.json_data = json_data
        self.status_code = status_code
        self.text = 'Mock response'

    def json(self):
        return self.json_data

    def raise_for_status(self):
        if self.status_code >= 400:
            raise requests.exceptions.HTTPError(response=self)


def mock_scfind_get(url, **kwargs):
    """Mock function for SCFIND API GET requests."""
    params = kwargs.get('params', {}) or {}
    has_atac_modality = params.get('modality') == 'ATAC'
    data = _scfind_response_for_url(url, has_atac_modality)
    if data is None:
        return _MockResponse({}, 404)
    return _MockResponse(data)


def mock_scfind_post(url, **kwargs):
    """Mock function for SCFIND API POST requests (comma-in-cell-type-name workaround)."""
    body = kwargs.get('json', {}) or {}
    has_atac_modality = body.get('modality') == 'ATAC'
    data = _scfind_response_for_url(url, has_atac_modality)
    if data is None:
        return _MockResponse({}, 404)
    return _MockResponse(data)


def mock_scfind_get_error(url, **kwargs):
    """Mock function that simulates SCFIND API errors."""

    class MockResponse:
        def __init__(self):
            self.status_code = 500
            self.text = 'Internal Server Error'

        def raise_for_status(self):
            raise requests.exceptions.HTTPError(response=self)

    return MockResponse()


def mock_scfind_get_timeout(url, **kwargs):
    """Mock function that simulates request timeout."""
    raise requests.exceptions.ConnectTimeout()


class TestSCFindEndpoints:
    """Test class for SCFIND route endpoints."""

    def test_cell_type_names_success(self, client, mocker):
        """Test successful retrieval of cell type names."""
        mocker.patch('requests.get', side_effect=mock_scfind_get)

        response = client.get('/scfind/cell-type-names.json')
        assert response.status_code == 200
        data = response.get_json()
        assert 'cell_types' in data
        assert data['cell_types'] == mock_cell_type_names['cellTypeNames']

    def test_cell_type_names_error(self, client, mocker):
        """Test error handling for cell type names endpoint."""
        # Mock the cached function directly to raise an exception
        mocker.patch(
            'app.routes_scfind._get_all_cell_type_names', side_effect=Exception('SCFIND API error')
        )

        response = client.get('/scfind/cell-type-names.json')
        assert response.status_code == 500
        data = response.get_json()
        assert 'error' in data
        assert 'An error occurred' in data['error']

    def test_genes_success(self, client, mocker):
        """Test successful retrieval of gene names."""
        mocker.patch('requests.get', side_effect=mock_scfind_get)

        response = client.get('/scfind/genes.json')
        assert response.status_code == 200
        data = response.get_json()
        assert 'genes' in data
        assert data['genes'] == mock_gene_names['genes']

    def test_genes_error(self, client, mocker):
        """Test error handling for genes endpoint."""
        mocker.patch('app.routes_scfind._get_all_genes', side_effect=Exception('SCFIND API error'))

        response = client.get('/scfind/genes.json')
        assert response.status_code == 500
        data = response.get_json()
        assert 'error' in data
        assert 'An error occurred' in data['error']

    def test_label_to_clid_map_success(self, client, mocker):
        """Test successful retrieval of label-to-CLID mapping."""
        mocker.patch('requests.get', side_effect=mock_scfind_get)

        response = client.get('/scfind/label-to-clid-map.json')
        assert response.status_code == 200
        data = response.get_json()
        # Should return a mapping dictionary
        assert isinstance(data, dict)

    def test_label_to_clid_map_error(self, client, mocker):
        """Test error handling for label-to-CLID mapping endpoint."""
        mocker.patch(
            'app.routes_scfind._build_label_to_clid_map',
            side_effect=Exception('SCFIND API error'),
        )

        response = client.get('/scfind/label-to-clid-map.json')
        assert response.status_code == 500
        data = response.get_json()
        assert 'error' in data
        assert 'An error occurred' in data['error']

    def test_clid_to_label_map_success(self, client, mocker):
        """Test successful retrieval of CLID-to-label mapping."""
        mocker.patch('requests.get', side_effect=mock_scfind_get)

        response = client.get('/scfind/clid-to-label-map.json')
        assert response.status_code == 200
        data = response.get_json()
        # Should return a mapping dictionary
        assert isinstance(data, dict)

    def test_clid_to_label_map_error(self, client, mocker):
        """Test error handling for CLID-to-label mapping endpoint."""
        mocker.patch(
            'app.routes_scfind._build_clid_to_label_map',
            side_effect=Exception('SCFIND API error'),
        )

        response = client.get('/scfind/clid-to-label-map.json')
        assert response.status_code == 500
        data = response.get_json()
        assert 'error' in data
        assert 'An error occurred' in data['error']

    def test_combined_maps_success(self, client, mocker):
        """Test successful retrieval of combined mappings."""
        mocker.patch('requests.get', side_effect=mock_scfind_get)

        response = client.get('/scfind/combined-maps.json')
        assert response.status_code == 200
        data = response.get_json()
        assert 'label_to_clid' in data
        assert 'clid_to_label' in data
        assert isinstance(data['label_to_clid'], dict)
        assert isinstance(data['clid_to_label'], dict)

    def test_combined_maps_error(self, client, mocker):
        """Test error handling for combined mappings endpoint."""
        mocker.patch(
            'app.routes_scfind._get_complete_mappings', side_effect=Exception('SCFIND API error')
        )

        response = client.get('/scfind/combined-maps.json')
        assert response.status_code == 500
        data = response.get_json()
        assert 'error' in data
        assert 'An error occurred' in data['error']


class TestGenesAutocomplete:
    """Test class for genes autocomplete endpoint."""

    def test_genes_autocomplete_success(self, client, mocker):
        """Test successful gene autocomplete search."""
        mocker.patch('requests.get', side_effect=mock_scfind_get)

        response = client.get('/scfind/genes/autocomplete?q=BRC&limit=5')
        assert response.status_code == 200
        data = response.get_json()
        assert 'results' in data
        assert isinstance(data['results'], list)

        # Check that results contain highlighting structure
        if data['results']:
            result = data['results'][0]
            assert 'full' in result
            assert 'pre' in result
            assert 'match' in result
            assert 'post' in result

    def test_genes_autocomplete_empty_query(self, client, mocker):
        """Test gene autocomplete with empty query."""
        mocker.patch('requests.get', side_effect=mock_scfind_get)

        response = client.get('/scfind/genes/autocomplete?q=')
        assert response.status_code == 200
        data = response.get_json()
        assert data['results'] == []

    def test_genes_autocomplete_no_query(self, client, mocker):
        """Test gene autocomplete without query parameter."""
        mocker.patch('requests.get', side_effect=mock_scfind_get)

        response = client.get('/scfind/genes/autocomplete')
        assert response.status_code == 200
        data = response.get_json()
        assert data['results'] == []

    def test_genes_autocomplete_limit_validation(self, client, mocker):
        """Test gene autocomplete limit parameter validation."""
        mocker.patch('requests.get', side_effect=mock_scfind_get)

        # Test limit above maximum (should be capped at 100)
        response = client.get('/scfind/genes/autocomplete?q=BRC&limit=150')
        assert response.status_code == 200

    def test_genes_autocomplete_error(self, client, mocker):
        """Test error handling for gene autocomplete."""
        mocker.patch('app.routes_scfind._get_all_genes', side_effect=Exception('SCFIND API error'))

        response = client.get('/scfind/genes/autocomplete?q=BRC')
        assert response.status_code == 500
        data = response.get_json()
        assert 'error' in data
        assert 'An error occurred' in data['error']


class TestCellTypesAutocomplete:
    """Test class for cell types autocomplete endpoint."""

    def test_cell_types_autocomplete_success(self, client, mocker):
        """Test successful cell type autocomplete search."""
        mocker.patch('requests.get', side_effect=mock_scfind_get)

        response = client.get('/scfind/cell-types/autocomplete?q=epithelial&limit=5')
        assert response.status_code == 200
        data = response.get_json()
        assert 'results' in data
        assert isinstance(data['results'], list)

        # Check that results contain expected structure
        if data['results']:
            result = data['results'][0]
            assert 'full' in result
            assert 'pre' in result
            assert 'match' in result
            assert 'post' in result
            assert 'tags' in result
            assert 'organs' in result
            assert 'values' in result

    def test_cell_types_autocomplete_empty_query(self, client, mocker):
        """Test cell type autocomplete with empty query."""
        mocker.patch('requests.get', side_effect=mock_scfind_get)

        response = client.get('/scfind/cell-types/autocomplete?q=')
        assert response.status_code == 200
        data = response.get_json()
        assert data['results'] == []

    def test_cell_types_autocomplete_no_query(self, client, mocker):
        """Test cell type autocomplete without query parameter."""
        mocker.patch('requests.get', side_effect=mock_scfind_get)

        response = client.get('/scfind/cell-types/autocomplete')
        assert response.status_code == 200
        data = response.get_json()
        assert data['results'] == []

    def test_cell_types_autocomplete_limit_validation(self, client, mocker):
        """Test cell type autocomplete limit parameter validation."""
        mocker.patch('requests.get', side_effect=mock_scfind_get)

        # Test limit above maximum (should be capped at 100)
        response = client.get('/scfind/cell-types/autocomplete?q=epithelial&limit=150')
        assert response.status_code == 200

    def test_cell_types_autocomplete_error(self, client, mocker):
        """Test error handling for cell type autocomplete."""
        mocker.patch(
            'app.routes_scfind._get_all_cell_type_names', side_effect=Exception('SCFIND API error')
        )

        response = client.get('/scfind/cell-types/autocomplete?q=epithelial')
        assert response.status_code == 500
        data = response.get_json()
        assert 'error' in data
        assert 'An error occurred' in data['error']


class TestGenesValidate:
    """Test class for genes validation endpoint."""

    def test_genes_validate_success(self, client, mocker):
        """Test successful gene validation."""
        mocker.patch('requests.get', side_effect=mock_scfind_get)

        test_genes = ['ACTB', 'GAPDH', 'INVALID_GENE', 'TP53']
        response = client.post('/scfind/genes/validate', json={'genes': test_genes})

        assert response.status_code == 200
        data = response.get_json()
        assert 'valid_genes' in data
        assert 'invalid_genes' in data
        assert 'total_provided' in data
        assert 'total_valid' in data

        assert data['total_provided'] == len(test_genes)
        assert 'ACTB' in data['valid_genes']
        assert 'GAPDH' in data['valid_genes']
        assert 'TP53' in data['valid_genes']
        assert 'INVALID_GENE' in data['invalid_genes']

    def test_genes_validate_empty_list(self, client, mocker):
        """Test gene validation with empty gene list."""
        mocker.patch('requests.get', side_effect=mock_scfind_get)

        response = client.post('/scfind/genes/validate', json={'genes': []})
        assert response.status_code == 200
        data = response.get_json()
        assert data['total_provided'] == 0
        assert data['total_valid'] == 0
        assert data['valid_genes'] == []
        assert data['invalid_genes'] == []

    def test_genes_validate_all_valid(self, client, mocker):
        """Test gene validation with all valid genes."""
        mocker.patch('requests.get', side_effect=mock_scfind_get)

        test_genes = ['ACTB', 'GAPDH', 'TP53']
        response = client.post('/scfind/genes/validate', json={'genes': test_genes})

        assert response.status_code == 200
        data = response.get_json()
        assert data['total_valid'] == 3
        assert len(data['invalid_genes']) == 0

    def test_genes_validate_all_invalid(self, client, mocker):
        """Test gene validation with all invalid genes."""
        mocker.patch('requests.get', side_effect=mock_scfind_get)

        test_genes = ['INVALID1', 'INVALID2', 'INVALID3']
        response = client.post('/scfind/genes/validate', json={'genes': test_genes})

        assert response.status_code == 200
        data = response.get_json()
        assert data['total_valid'] == 0
        assert len(data['invalid_genes']) == 3

    def test_genes_validate_missing_json(self, client):
        """Test gene validation without JSON content type."""
        response = client.post('/scfind/genes/validate', data='not json')
        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data
        assert data['error'] == 'Request must be JSON'

    def test_genes_validate_missing_genes_key(self, client):
        """Test gene validation without 'genes' key in request."""
        response = client.post('/scfind/genes/validate', json={'invalid_key': []})
        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data
        assert data['error'] == 'Missing "genes" array in request body'

    def test_genes_validate_invalid_genes_type(self, client):
        """Test gene validation with invalid genes data type."""
        response = client.post('/scfind/genes/validate', json={'genes': 'not_a_list'})
        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data
        assert data['error'] == '"genes" must be an array'

    def test_genes_validate_empty_json(self, client):
        """Test gene validation with empty JSON body."""
        response = client.post('/scfind/genes/validate', json={})
        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data
        assert data['error'] == 'Missing "genes" array in request body'

    def test_genes_validate_non_string_genes(self, client, mocker):
        """Test gene validation with non-string gene values."""
        mocker.patch('requests.get', side_effect=mock_scfind_get)

        test_genes = ['ACTB', 123, None, 'GAPDH']
        response = client.post('/scfind/genes/validate', json={'genes': test_genes})

        assert response.status_code == 200
        data = response.get_json()
        assert 'ACTB' in data['valid_genes']
        assert 'GAPDH' in data['valid_genes']
        assert 123 in data['invalid_genes']
        assert None in data['invalid_genes']

    def test_genes_validate_error(self, client, mocker):
        """Test error handling for gene validation."""
        mocker.patch('app.routes_scfind._get_all_genes', side_effect=Exception('SCFIND API error'))

        response = client.post('/scfind/genes/validate', json={'genes': ['ACTB']})
        assert response.status_code == 500
        data = response.get_json()
        assert 'error' in data
        assert 'An error occurred' in data['error']


class TestRequestTimeouts:
    """Test class for handling request timeouts."""

    def test_timeout_returns_504(self, client, mocker):
        """Test that timeout exceptions return 504 with a user-friendly message."""
        mocker.patch(
            'app.routes_scfind._get_all_genes',
            side_effect=requests.exceptions.Timeout('Connection timed out'),
        )

        response = client.get('/scfind/genes.json')
        assert response.status_code == 504
        data = response.get_json()
        assert 'error' in data
        assert 'took too long' in data['error']

    def test_generic_error_returns_500(self, client, mocker):
        """Test that non-timeout exceptions return 500."""
        mocker.patch(
            'app.routes_scfind._get_all_genes',
            side_effect=Exception('Something went wrong'),
        )

        response = client.get('/scfind/genes.json')
        assert response.status_code == 500
        data = response.get_json()
        assert 'error' in data
        assert 'An error occurred' in data['error']

    def test_timeout_on_autocomplete(self, client, mocker):
        """Test timeout handling on autocomplete endpoint."""
        mocker.patch(
            'app.routes_scfind._get_all_genes',
            side_effect=requests.exceptions.Timeout('Read timed out'),
        )

        response = client.get('/scfind/genes/autocomplete?q=ACT')
        assert response.status_code == 504
        data = response.get_json()
        assert 'took too long' in data['error']

    def test_timeout_on_pathway_genes(self, client, mocker):
        """Test timeout handling on pathway-genes endpoint."""
        mocker.patch(
            'app.utils.fetch_pathway_participants',
            side_effect=requests.exceptions.Timeout('Read timed out'),
        )

        response = client.post('/scfind/pathway-genes', json={'pathway_code': 'R-HSA-12345'})
        assert response.status_code == 504
        data = response.get_json()
        assert 'took too long' in data['error']

    def test_make_scfind_request_has_timeout(self, client, mocker):
        """Test that _make_scfind_request passes timeout to requests.get."""
        mock_get = mocker.patch('requests.get', side_effect=mock_scfind_get)

        with client.application.app_context():
            routes_scfind._make_scfind_request('scfindGenes')

        mock_get.assert_called_once()
        _, kwargs = mock_get.call_args
        assert kwargs.get('timeout') == routes_scfind.EXTERNAL_REQUEST_TIMEOUT


class TestModalitySupport:
    """Test class for modality parameter support across endpoints."""

    def test_genes_autocomplete_with_atac_modality(self, client, mocker):
        """Test gene autocomplete returns ATAC-specific genes."""
        mocker.patch('requests.get', side_effect=mock_scfind_get)

        response = client.get('/scfind/genes/autocomplete?q=ACT&modality=ATAC')
        assert response.status_code == 200
        data = response.get_json()
        assert 'results' in data
        # ACTB is in ATAC genes, so it should match
        gene_names = [r['full'] for r in data['results']]
        assert 'ACTB' in gene_names

    def test_genes_autocomplete_atac_excludes_rna_only_genes(self, client, mocker):
        """Test ATAC gene autocomplete does not return RNA-only genes."""
        mocker.patch('requests.get', side_effect=mock_scfind_get)

        # GAPDH is in RNA genes but not in ATAC genes
        response = client.get('/scfind/genes/autocomplete?q=GAP&modality=ATAC')
        assert response.status_code == 200
        data = response.get_json()
        gene_names = [r['full'] for r in data['results']]
        assert 'GAPDH' not in gene_names

    def test_cell_types_autocomplete_with_atac_modality(self, client, mocker):
        """Test cell type autocomplete returns ATAC-specific cell types."""
        mocker.patch('requests.get', side_effect=mock_scfind_get)

        response = client.get('/scfind/cell-types/autocomplete?q=epithelial&modality=ATAC')
        assert response.status_code == 200
        data = response.get_json()
        assert 'results' in data
        assert isinstance(data['results'], list)

    def test_genes_validate_with_atac_modality(self, client, mocker):
        """Test gene validation with ATAC modality."""
        mocker.patch('requests.get', side_effect=mock_scfind_get)

        # ACTB and TP53 are in ATAC genes; GAPDH and MYC are not
        test_genes = ['ACTB', 'GAPDH', 'TP53', 'MYC']
        response = client.post(
            '/scfind/genes/validate', json={'genes': test_genes, 'modality': 'ATAC'}
        )

        assert response.status_code == 200
        data = response.get_json()
        assert 'ACTB' in data['valid_genes']
        assert 'TP53' in data['valid_genes']
        assert 'GAPDH' in data['invalid_genes']
        assert 'MYC' in data['invalid_genes']

    def test_genes_json_with_atac_modality(self, client, mocker):
        """Test genes.json endpoint with ATAC modality."""
        mocker.patch('requests.get', side_effect=mock_scfind_get)

        response = client.get('/scfind/genes.json?modality=ATAC')
        assert response.status_code == 200
        data = response.get_json()
        assert data['genes'] == mock_atac_gene_names['genes']

    def test_cell_type_names_json_with_atac_modality(self, client, mocker):
        """Test cell-type-names.json endpoint with ATAC modality."""
        mocker.patch('requests.get', side_effect=mock_scfind_get)

        response = client.get('/scfind/cell-type-names.json?modality=ATAC')
        assert response.status_code == 200
        data = response.get_json()
        assert data['cell_types'] == mock_atac_cell_type_names['cellTypeNames']


class TestPathwayGenes:
    """Test class for the /scfind/pathway-genes endpoint."""

    def test_pathway_genes_success(self, client, mocker):
        """Test successful pathway gene validation."""
        mocker.patch('requests.get', side_effect=mock_scfind_get)

        response = client.post('/scfind/pathway-genes', json={'pathway_code': 'R-HSA-12345'})
        assert response.status_code == 200
        data = response.get_json()
        assert 'valid_genes' in data
        assert 'invalid_genes' in data
        assert 'total_genes' in data
        assert 'total_valid' in data

        # ACTB and TP53 should be valid (in mock_gene_names), INVALID_GENE should not
        assert 'ACTB' in data['valid_genes']
        assert 'TP53' in data['valid_genes']
        assert 'INVALID_GENE' in data['invalid_genes']
        assert data['total_genes'] == 3
        assert data['total_valid'] == 2

    def test_pathway_genes_with_atac_modality(self, client, mocker):
        """Test pathway gene validation with ATAC modality."""
        mocker.patch('requests.get', side_effect=mock_scfind_get)

        response = client.post(
            '/scfind/pathway-genes',
            json={'pathway_code': 'R-HSA-12345', 'modality': 'ATAC'},
        )
        assert response.status_code == 200
        data = response.get_json()

        # With ATAC modality: ACTB and TP53 are in ATAC genes, INVALID_GENE is not
        assert 'ACTB' in data['valid_genes']
        assert 'TP53' in data['valid_genes']
        assert 'INVALID_GENE' in data['invalid_genes']

    def test_pathway_genes_missing_json(self, client):
        """Test pathway genes without JSON content type."""
        response = client.post('/scfind/pathway-genes', data='not json')
        assert response.status_code == 400
        data = response.get_json()
        assert data['error'] == 'Request must be JSON'

    def test_pathway_genes_missing_pathway_code(self, client):
        """Test pathway genes without pathway_code."""
        response = client.post('/scfind/pathway-genes', json={'modality': 'ATAC'})
        assert response.status_code == 400
        data = response.get_json()
        assert data['error'] == 'Missing "pathway_code" in request body'

    @pytest.mark.parametrize(
        'pathway_code',
        ['../../admin', 'R-HSA-1/../../x', 'not-a-code', 'R-HSA-', 123],
    )
    def test_pathway_genes_invalid_code(self, client, pathway_code):
        """Malformed pathway codes are rejected before any UBKG request is issued."""
        response = client.post('/scfind/pathway-genes', json={'pathway_code': pathway_code})
        assert response.status_code == 400
        data = response.get_json()
        assert data['error'] == 'Invalid "pathway_code" format.'

    def test_pathway_genes_ubkg_error(self, client, mocker):
        """Test pathway genes when UBKG fetch fails."""
        mocker.patch(
            'app.utils.fetch_pathway_participants',
            side_effect=Exception('UBKG error'),
        )

        response = client.post('/scfind/pathway-genes', json={'pathway_code': 'R-HSA-99999'})
        assert response.status_code == 500
        data = response.get_json()
        assert 'An error occurred' in data['error']


class TestPerOperationProxyRoutes:
    """The per-operation proxy routes forward to scfind and return its native shape."""

    def test_hyper_query_cell_types(self, client, mocker):
        mocker.patch('requests.get', side_effect=mock_scfind_get)
        response = client.get('/scfind/hyper-query-cell-types.json?gene_list=VIM')
        assert response.status_code == 200
        assert response.get_json() == mock_hyper_query

    def test_find_datasets(self, client, mocker):
        mocker.patch('requests.get', side_effect=mock_scfind_get)
        response = client.get('/scfind/find-datasets.json?gene_list=VIM')
        assert response.status_code == 200
        assert response.get_json() == mock_find_datasets

    def test_cell_type_count_for_tissue(self, client, mocker):
        mocker.patch('requests.get', side_effect=mock_scfind_get)
        response = client.get('/scfind/cell-type-count-for-tissue.json?tissue=kidney')
        assert response.status_code == 200
        assert response.get_json() == mock_cell_type_count_for_tissue

    def test_indexed_datasets(self, client, mocker):
        mocker.patch('requests.get', side_effect=mock_scfind_get)
        response = client.get('/scfind/indexed-datasets.json')
        assert response.status_code == 200
        assert response.get_json() == mock_indexed_datasets

    def test_marker_genes_returns_list(self, client, mocker):
        mocker.patch('requests.get', side_effect=mock_scfind_get)
        response = client.get('/scfind/marker-genes.json?marker_genes=VIM')
        assert response.status_code == 200
        assert response.get_json() == mock_marker_genes

    def test_expression_bins_not_shadowed_by_expression(self, client, mocker):
        # getCellTypeExpression is a prefix of getCellTypeExpressionBinData; make sure the bins
        # route hits the right upstream endpoint.
        mock_get = mocker.patch('requests.get', side_effect=mock_scfind_get)
        client.get('/scfind/cell-type-expression-bins.json?gene_list=VIM&cell_type=kidney.x')
        called_url = mock_get.call_args[0][0]
        assert 'getCellTypeExpressionBinData' in called_url

    def test_index_version_injected_server_side(self, client, mocker):
        mock_get = mocker.patch('requests.get', side_effect=mock_scfind_get)
        client.get('/scfind/find-datasets.json?gene_list=VIM')
        _, kwargs = mock_get.call_args
        assert kwargs['params']['index_version'] == 'v1.0'

    def test_index_version_omitted_when_blank(self, client, mocker):
        # When no index version is configured, it must not be sent (scfind resolves the latest).
        client.application.config['SCFIND_DEFAULT_INDEX_VERSION'] = ''
        routes_scfind._cached_scfind_get.cache_clear()
        mock_get = mocker.patch('requests.get', side_effect=mock_scfind_get)
        client.get('/scfind/find-datasets.json?gene_list=VIM')
        _, kwargs = mock_get.call_args
        assert 'index_version' not in kwargs['params']

    def test_get_response_is_cached(self, client, mocker):
        # Two identical GETs in one worker hit the upstream once (shared lru_cache).
        mock_get = mocker.patch('requests.get', side_effect=mock_scfind_get)
        client.get('/scfind/find-datasets.json?gene_list=VIM')
        client.get('/scfind/find-datasets.json?gene_list=VIM')
        assert mock_get.call_count == 1

    def test_post_forwards_json_body(self, client, mocker):
        # Comma-containing cell type names dispatch to POST; the body is forwarded to scfind POST.
        mock_post = mocker.patch('requests.post', side_effect=mock_scfind_post)
        response = client.post(
            '/scfind/cell-type-markers.json', json={'cell_types': ['kidney.T cell, regulatory']}
        )
        assert response.status_code == 200
        assert response.get_json() == mock_cell_type_markers
        mock_post.assert_called_once()
        _, kwargs = mock_post.call_args
        # index_version is injected into the POST body server-side.
        assert kwargs['json']['index_version'] == 'v1.0'
        assert kwargs['json']['cell_types'] == ['kidney.T cell, regulatory']

    def test_proxy_timeout_returns_504(self, client, mocker):
        mocker.patch('requests.get', side_effect=requests.exceptions.Timeout('timed out'))
        response = client.get('/scfind/find-datasets.json?gene_list=VIM')
        assert response.status_code == 504
        assert 'took too long' in response.get_json()['error']

    def test_proxy_error_returns_500(self, client, mocker):
        mocker.patch('requests.get', side_effect=Exception('boom'))
        response = client.get('/scfind/find-datasets.json?gene_list=VIM')
        assert response.status_code == 500
        assert 'An error occurred' in response.get_json()['error']


class TestExtractCellTypesInfo:
    """Pure unit tests for the Python port of the frontend extractCellTypesInfo."""

    def test_parses_name_organs_variants(self):
        result = routes_scfind._extract_cell_types_info(
            ['kidney.B cell:1', 'lung.B cell', 'kidney.B cell:2']
        )
        assert result['name'] == 'B cell'
        assert result['organs'] == ['kidney', 'lung']
        assert result['variants'] == {'kidney': ['1', '2'], 'lung': []}

    def test_empty(self):
        assert routes_scfind._extract_cell_types_info([]) == {
            'name': '',
            'organs': [],
            'variants': {},
        }


class TestPerPageAggregates:
    """The per-page aggregate routes assemble all the scfind data a reworked page needs."""

    def test_cell_types_landing(self, client, mocker):
        mocker.patch('requests.get', side_effect=mock_scfind_get)
        response = client.get('/scfind/cell-types-landing.json')
        assert response.status_code == 200
        data = response.get_json()
        assert data['cell_type_names'] == mock_cell_type_names['cellTypeNames']
        assert data['cell_type_names_atac'] == mock_atac_cell_type_names['cellTypeNames']
        # Organs are deduped in first-occurrence order from the RNA names.
        assert data['organs'] == ['kidney', 'heart', 'lung']
        # Per-label dataset counts for the Data Type chips: one dataset contains the cell type for
        # each modality in the mocks (cellTypeCountForDataset index 'epithelial cell').
        assert data['dataset_counts']['epithelial cell'] == {'rna': 1, 'atac': 1}
        # Cell Ontology descriptions (from UBKG) cached in the payload, keyed by full CLID.
        assert data['descriptions']['CL:0000066'] == 'A mock epithelial cell definition.'

    def test_cell_types_landing_error(self, client, mocker):
        mocker.patch(
            'app.routes_scfind._build_cell_types_landing',
            side_effect=Exception('SCFIND API error'),
        )
        response = client.get('/scfind/cell-types-landing.json')
        assert response.status_code == 500
        assert 'An error occurred' in response.get_json()['error']

    def test_gene_detail(self, client, mocker):
        mocker.patch('requests.get', side_effect=mock_scfind_get)
        response = client.get('/scfind/gene-detail/VIM.json')
        assert response.status_code == 200
        data = response.get_json()
        assert data['hyper_query'] == mock_hyper_query['findGeneSignatures']
        assert data['find_datasets'] == mock_find_datasets
        assert data['organs'] == ['kidney']
        assert 'kidney.epithelial cell' in data['label_to_clid']
        # RNA + ATAC variants for the cell-types and datasets modality tabs (with counts).
        assert 'hyper_query_atac' in data
        assert 'find_datasets_atac' in data
        assert 'organs_atac' in data

    def test_gene_detail_atac_only_gene(self, client, mocker):
        """A gene indexed only in ATAC must not 500: the failing RNA queries degrade to empty."""

        def atac_only_get(url, **kwargs):
            params = kwargs.get('params', {}) or {}
            is_atac = params.get('modality') == 'ATAC'
            # The gene is absent from the RNA index, so its non-modality gene queries error; ATAC
            # queries and the label->CLID mapping calls succeed via the normal mock.
            if not is_atac and ('hyperQueryCellTypes' in url or 'findDatasets' in url):
                raise requests.exceptions.HTTPError('gene not in RNA index')
            return mock_scfind_get(url, **kwargs)

        mocker.patch('requests.get', side_effect=atac_only_get)
        mocker.patch('requests.post', side_effect=mock_scfind_post)
        response = client.get('/scfind/gene-detail/ATAConlyGene.json')
        assert response.status_code == 200
        data = response.get_json()
        # RNA queries degraded to empty rather than failing the page...
        assert data['hyper_query'] == []
        assert data['find_datasets'] == {'counts': {}, 'findDatasets': {}}
        assert data['organs'] == []
        # ...while the ATAC data is populated so the page can focus on the ATAC modality.
        assert data['hyper_query_atac'] == mock_hyper_query['findGeneSignatures']
        assert data['find_datasets_atac'] == mock_find_datasets
        assert data['organs_atac'] == ['kidney']

    @pytest.mark.parametrize('gene_symbol', ['a%20b', '.hidden', 'a%3Bb'])
    def test_gene_detail_invalid_symbol(self, client, mocker, gene_symbol):
        mock_get = mocker.patch('requests.get', side_effect=mock_scfind_get)
        response = client.get(f'/scfind/gene-detail/{gene_symbol}.json')
        assert response.status_code == 400
        assert 'Invalid gene symbol' in response.get_json()['error']
        mock_get.assert_not_called()

    def test_cell_type_detail(self, client, mocker):
        mocker.patch('requests.get', side_effect=mock_scfind_get)
        # CL:0000066 is one of the CLIDs the mock label->CLID map produces.
        response = client.get('/scfind/cell-type-detail/CL:0000066.json')
        assert response.status_code == 200
        data = response.get_json()
        assert data['cell_types'] == mock_clid_to_label['cell_types']
        assert 'markers' in data
        assert 'datasets_for_cell_types' in data
        assert 'name' in data
        assert 'organs' in data
        assert 'variants' in data
        # RNA + ATAC variants for the biomarker / dataset modality tabs.
        assert 'markers_atac' in data
        assert 'datasets_for_cell_types_atac' in data

    def test_cell_type_detail_marker_failure(self, client, mocker):
        """An scFind error on one modality's markers degrades to empty instead of 500ing the page."""

        def fail_atac_markers_get(url, **kwargs):
            params = kwargs.get('params', {}) or {}
            if 'cellTypeMarkers' in url and params.get('modality') == 'ATAC':
                raise requests.exceptions.HTTPError('cellTypeMarkers failed for ATAC')
            return mock_scfind_get(url, **kwargs)

        def fail_atac_markers_post(url, **kwargs):
            body = kwargs.get('json', {}) or {}
            if 'cellTypeMarkers' in url and body.get('modality') == 'ATAC':
                raise requests.exceptions.HTTPError('cellTypeMarkers failed for ATAC')
            return mock_scfind_post(url, **kwargs)

        mocker.patch('requests.get', side_effect=fail_atac_markers_get)
        mocker.patch('requests.post', side_effect=fail_atac_markers_post)
        response = client.get('/scfind/cell-type-detail/CL:0000066.json')
        assert response.status_code == 200
        data = response.get_json()
        # The failing ATAC markers op degrades to empty rather than failing the whole aggregate...
        assert data['markers_atac'] == []
        # ...while the RNA markers and both datasets slices stay populated.
        assert data['markers'] == mock_cell_type_markers['findGeneSignatures']
        assert 'datasets_for_cell_types' in data
        assert 'datasets_for_cell_types_atac' in data

    def test_label_to_clid_posts_comma_cell_types(self, client, mocker):
        """A comma in a cell type name (e.g. "CD4-positive, alpha-beta T cell") must be POSTed, not
        sent as a GET query param scFind would split into multiple cell types — otherwise the cell
        type's CLID is lost from the label<->CLID maps and its detail page can't resolve."""
        get_mock = mocker.patch('requests.get', side_effect=mock_scfind_get)
        post_mock = mocker.patch('requests.post', side_effect=mock_scfind_post)
        with client.application.app_context():
            clids = routes_scfind._get_label_to_clid_mapping(
                'blood.CD4-positive, alpha-beta T cell'
            )
        assert clids == mock_label_to_clid['CLIDs']
        # The comma-containing lookup went out as a POST, not a GET.
        assert any('CellType2CLID' in call.args[0] for call in post_mock.call_args_list)
        assert not any('CellType2CLID' in call.args[0] for call in get_mock.call_args_list)

    def test_peek_cell_type_name(self, client, mocker):
        """The detail-page name resolves from the warmed CLID->label map without triggering a build."""
        mocker.patch('requests.get', side_effect=mock_scfind_get)
        mocker.patch('requests.post', side_effect=mock_scfind_post)
        with client.application.app_context():
            # Map not built/cached yet -> empty name, and no build is triggered.
            assert routes_scfind.peek_cell_type_name('CL:0000066') == ''
            # Once the map is built/cached, the name resolves synchronously from cache.
            routes_scfind._build_clid_to_label_map()
            assert routes_scfind.peek_cell_type_name('CL:0000066') == 'epithelial cell'

    @pytest.mark.parametrize('clid', ['cl:0000236', 'CL:abc', 'CL%3A', '0000236'])
    def test_cell_type_detail_invalid_clid(self, client, mocker, clid):
        mock_get = mocker.patch('requests.get', side_effect=mock_scfind_get)
        response = client.get(f'/scfind/cell-type-detail/{clid}.json')
        assert response.status_code == 400
        assert 'Invalid cell type ID' in response.get_json()['error']
        mock_get.assert_not_called()

    def test_organ_cell_types(self, client, mocker):
        mocker.patch('requests.get', side_effect=mock_scfind_get)
        mocker.patch('requests.post', side_effect=mock_scfind_post)
        response = client.get('/scfind/organ-cell-types/kidney.json')
        assert response.status_code == 200
        data = response.get_json()
        # RNA + ATAC slices for the table's modality tabs.
        assert 'cell_types' in data
        assert 'cell_types_atac' in data
        # The organ's cell types come through (prefix stripped) with the joined per-row fields.
        names = {row['name'] for row in data['cell_types']}
        assert 'epithelial cell' in names
        row = next(r for r in data['cell_types'] if r['name'] == 'epithelial cell')
        assert set(row) == {'name', 'clid', 'description', 'datasets'}

    @pytest.mark.parametrize('organ', ['a1b', 'a;b', 'x' * 51])
    def test_organ_cell_types_invalid_organ(self, client, mocker, organ):
        mock_get = mocker.patch('requests.get', side_effect=mock_scfind_get)
        response = client.get(f'/scfind/organ-cell-types/{organ}.json')
        assert response.status_code == 400
        assert 'Invalid organ' in response.get_json()['error']
        mock_get.assert_not_called()


class TestSharedMapCache:
    """The aggregate maps are built at most once across processes/calls."""

    def test_get_or_build_map_builds_once(self, tmp_path):
        app = create_app(testing=True)
        app.config['SCFIND_CACHE_DIR'] = str(tmp_path)
        routes_scfind._memory_cache.clear()

        calls = {'n': 0}

        def builder():
            calls['n'] += 1
            return {'cell': ['CL:0001']}

        with app.app_context():
            assert routes_scfind._get_or_build_map('m', builder) == {'cell': ['CL:0001']}
            # Second call within the worker is served from the in-process memo.
            assert routes_scfind._get_or_build_map('m', builder) == {'cell': ['CL:0001']}
            # Clearing the memo simulates a fresh worker process: it must read
            # the shared file written by the first build, not rebuild.
            routes_scfind._memory_cache.clear()
            assert routes_scfind._get_or_build_map('m', builder) == {'cell': ['CL:0001']}

        assert calls['n'] == 1

    def test_get_or_build_map_rebuilds_when_ttl_expires(self, tmp_path):
        app = create_app(testing=True)
        app.config['SCFIND_CACHE_DIR'] = str(tmp_path)
        app.config['SCFIND_CACHE_TTL'] = 60  # 1 minute
        routes_scfind._memory_cache.clear()

        calls = {'n': 0}

        def builder():
            calls['n'] += 1
            return {'cell': ['CL:0001']}

        with app.app_context():
            routes_scfind._get_or_build_map('m', builder)
            path = routes_scfind._scfind_cache_path('m')

        # Age the cached file well past the TTL, then a fresh worker must rebuild.
        old = time.time() - 3600
        os.utime(path, (old, old))
        routes_scfind._memory_cache.clear()
        with app.app_context():
            routes_scfind._get_or_build_map('m', builder)

        assert calls['n'] == 2

    def test_cache_token_isolates_server_starts(self, tmp_path, monkeypatch):
        app = create_app(testing=True)
        app.config['SCFIND_CACHE_DIR'] = str(tmp_path)
        with app.app_context():
            monkeypatch.delenv('SCFIND_CACHE_TOKEN', raising=False)
            no_token = routes_scfind._scfind_cache_path('m')
            monkeypatch.setenv('SCFIND_CACHE_TOKEN', '111')
            start_a = routes_scfind._scfind_cache_path('m')
            monkeypatch.setenv('SCFIND_CACHE_TOKEN', '222')
            start_b = routes_scfind._scfind_cache_path('m')

        # A new per-start token yields a distinct path, so each server start
        # builds fresh; the tokenless (dev) path is distinct from both.
        assert start_a != start_b
        assert '111' in start_a and '222' in start_b
        assert no_token != start_a


@pytest.mark.parametrize(
    'endpoint,method,expected_status',
    [
        ('/scfind/cell-type-names.json', 'GET', 200),
        ('/scfind/genes.json', 'GET', 200),
        ('/scfind/label-to-clid-map.json', 'GET', 200),
        ('/scfind/clid-to-label-map.json', 'GET', 200),
        ('/scfind/combined-maps.json', 'GET', 200),
        ('/scfind/genes/autocomplete', 'GET', 200),
        ('/scfind/cell-types/autocomplete', 'GET', 200),
        ('/scfind/genes/validate', 'POST', 400),  # No JSON body
        ('/scfind/pathway-genes', 'POST', 400),  # No JSON body
        ('/scfind/hyper-query-cell-types.json', 'GET', 200),
        ('/scfind/find-datasets.json', 'GET', 200),
        ('/scfind/find-dataset-for-cell-type.json', 'GET', 200),
        ('/scfind/cell-type-count-for-dataset.json', 'GET', 200),
        ('/scfind/cell-type-count-for-tissue.json', 'GET', 200),
        ('/scfind/cell-type-expression.json', 'GET', 200),
        ('/scfind/cell-type-expression-bins.json', 'GET', 200),
        ('/scfind/cell-type-markers.json', 'GET', 200),
        ('/scfind/evaluate-markers.json', 'GET', 200),
        ('/scfind/find-gene-signatures.json', 'GET', 200),
        ('/scfind/find-similar-genes.json', 'GET', 200),
        ('/scfind/marker-genes.json', 'GET', 200),
        ('/scfind/find-housekeeping-genes.json', 'GET', 200),
        ('/scfind/find-cell-type-specificities.json', 'GET', 200),
        ('/scfind/find-tissue-specificities.json', 'GET', 200),
        ('/scfind/indexed-datasets.json', 'GET', 200),
        ('/scfind/cell-types-landing.json', 'GET', 200),
        ('/scfind/gene-detail/VIM.json', 'GET', 200),
        ('/scfind/cell-type-detail/CL:0000066.json', 'GET', 200),
        ('/scfind/organ-cell-types/kidney.json', 'GET', 200),
    ],
)
def test_endpoint_accessibility(client, mocker, endpoint, method, expected_status):
    """Test that all endpoints are accessible and return expected status codes."""
    mocker.patch('requests.get', side_effect=mock_scfind_get)

    if method == 'GET':
        response = client.get(endpoint)
    else:  # POST
        response = client.post(endpoint)

    assert response.status_code == expected_status
