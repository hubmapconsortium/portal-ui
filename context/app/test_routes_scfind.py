import pytest
import requests

from .main import create_app
from . import routes_scfind


@pytest.fixture
def client():
    app = create_app(testing=True)
    # Set mock config values for SCFIND
    app.config['SCFIND_ENDPOINT'] = 'https://mock.scfind.api'
    app.config['SCFIND_DEFAULT_INDEX_VERSION'] = 'v1.0'
    app.config['SCFIND_MAX_WORKERS'] = 2  # Low value for tests
    with app.test_client() as client:
        # Clear any cached data before each test
        if hasattr(routes_scfind._get_all_cell_type_names, 'cache_clear'):
            routes_scfind._get_all_cell_type_names.cache_clear()
        if hasattr(routes_scfind._get_all_genes, 'cache_clear'):
            routes_scfind._get_all_genes.cache_clear()
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
        yield client


# Mock data for various SCFIND responses
mock_cell_type_names = {
    'cellTypeNames': [
        'kidney.epithelial cell',
        'kidney.mesenchymal cell',
        'heart.cardiomyocyte',
        'heart.endothelial cell',
        'lung.alveolar epithelial cell',
        'lung.macrophage'
    ]
}

mock_gene_names = {
    'genes': ['ACTB', 'GAPDH', 'TP53', 'MYC', 'EGFR', 'BRCA1', 'BRCA2']
}

mock_label_to_clid = {
    'CLIDs': ['CL:0000066', 'CL:0000067']
}

mock_clid_to_label = {
    'cell_types': ['epithelial cell', 'mesenchymal cell']
}


def mock_scfind_get(url, **kwargs):
    """Mock function for SCFIND API requests."""
    class MockResponse:
        def __init__(self, json_data, status_code=200):
            self.json_data = json_data
            self.status_code = status_code
            self.text = 'Mock response'

        def json(self):
            return self.json_data

        def raise_for_status(self):
            if self.status_code >= 400:
                raise requests.exceptions.HTTPError(response=self)

    # Determine response based on URL
    if 'cellTypeNames' in url:
        return MockResponse(mock_cell_type_names)
    elif 'scfindGenes' in url:
        return MockResponse(mock_gene_names)
    elif 'CellType2CLID' in url:
        return MockResponse(mock_label_to_clid)
    elif 'CLID2CellType' in url:
        return MockResponse(mock_clid_to_label)
    else:
        return MockResponse({}, 404)


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
        mocker.patch('app.routes_scfind._get_all_cell_type_names',
                     side_effect=Exception("SCFIND API error"))

        response = client.get('/scfind/cell-type-names.json')
        assert response.status_code == 500
        data = response.get_json()
        assert 'error' in data
        assert data['error'] == 'Failed to fetch cell type names'

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
        mocker.patch('app.routes_scfind._get_all_genes',
                     side_effect=Exception("SCFIND API error"))

        response = client.get('/scfind/genes.json')
        assert response.status_code == 500
        data = response.get_json()
        assert 'error' in data
        assert data['error'] == 'Failed to fetch gene names'

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
        mocker.patch('app.routes_scfind._get_complete_mappings',
                     side_effect=Exception("SCFIND API error"))

        response = client.get('/scfind/label-to-clid-map.json')
        assert response.status_code == 500
        data = response.get_json()
        assert 'error' in data
        assert data['error'] == 'Failed to build label-to-CLID mapping'

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
        mocker.patch('app.routes_scfind._get_complete_mappings',
                     side_effect=Exception("SCFIND API error"))

        response = client.get('/scfind/clid-to-label-map.json')
        assert response.status_code == 500
        data = response.get_json()
        assert 'error' in data
        assert data['error'] == 'Failed to build CLID-to-label mapping'

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
        mocker.patch('app.routes_scfind._get_complete_mappings',
                     side_effect=Exception("SCFIND API error"))

        response = client.get('/scfind/combined-maps.json')
        assert response.status_code == 500
        data = response.get_json()
        assert 'error' in data
        assert data['error'] == 'Failed to build mappings'


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
        mocker.patch('app.routes_scfind._get_all_genes',
                     side_effect=Exception("SCFIND API error"))

        response = client.get('/scfind/genes/autocomplete?q=BRC')
        assert response.status_code == 500
        data = response.get_json()
        assert 'error' in data
        assert data['error'] == 'Failed to search genes'


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
        mocker.patch('app.routes_scfind._get_all_cell_type_names',
                     side_effect=Exception("SCFIND API error"))

        response = client.get('/scfind/cell-types/autocomplete?q=epithelial')
        assert response.status_code == 500
        data = response.get_json()
        assert 'error' in data
        assert data['error'] == 'Failed to search cell types'


class TestGenesValidate:
    """Test class for genes validation endpoint."""

    def test_genes_validate_success(self, client, mocker):
        """Test successful gene validation."""
        mocker.patch('requests.get', side_effect=mock_scfind_get)

        test_genes = ['ACTB', 'GAPDH', 'INVALID_GENE', 'TP53']
        response = client.post('/scfind/genes/validate',
                               json={'genes': test_genes})

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
        mocker.patch('app.routes_scfind._get_all_genes',
                     side_effect=Exception("SCFIND API error"))

        response = client.post('/scfind/genes/validate', json={'genes': ['ACTB']})
        assert response.status_code == 500
        data = response.get_json()
        assert 'error' in data
        assert data['error'] == 'Failed to validate genes'


class TestRequestTimeouts:
    """Test class for handling request timeouts."""

    def test_timeout_handling(self, client, mocker):
        """Test that timeout exceptions are properly handled."""
        mocker.patch('app.routes_scfind._get_all_genes',
                     side_effect=Exception("Request timeout"))

        # Test with a simple endpoint
        response = client.get('/scfind/genes.json')
        assert response.status_code == 500
        data = response.get_json()
        assert 'error' in data


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
    ]
)
def test_endpoint_accessibility(client, mocker, endpoint, method, expected_status):
    """Test that all endpoints are accessible and return expected status codes."""
    mocker.patch('requests.get', side_effect=mock_scfind_get)

    if method == 'GET':
        response = client.get(endpoint)
    else:  # POST
        response = client.post(endpoint)

    assert response.status_code == expected_status
