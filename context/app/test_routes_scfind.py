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
    app.config['UBKG_ENDPOINT'] = 'https://mock.ubkg.api'
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
        if hasattr(routes_scfind._fetch_pathway_participants, 'cache_clear'):
            routes_scfind._fetch_pathway_participants.cache_clear()
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

    # Check for modality parameter in params
    params = kwargs.get('params', {}) or {}
    has_atac_modality = params.get('modality') == 'ATAC'

    # Determine response based on URL
    if 'cellTypeNames' in url:
        return MockResponse(
            mock_atac_cell_type_names if has_atac_modality else mock_cell_type_names
        )
    elif 'scfindGenes' in url:
        return MockResponse(mock_atac_gene_names if has_atac_modality else mock_gene_names)
    elif 'CellType2CLID' in url:
        return MockResponse(mock_label_to_clid)
    elif 'CLID2CellType' in url:
        return MockResponse(mock_clid_to_label)
    elif 'pathways' in url and 'participants' in url:
        return MockResponse(mock_ubkg_pathway_response)
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
            'app.routes_scfind._get_complete_mappings', side_effect=Exception('SCFIND API error')
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
            'app.routes_scfind._get_complete_mappings', side_effect=Exception('SCFIND API error')
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
            'app.routes_scfind._fetch_pathway_participants',
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
        assert kwargs.get('timeout') == routes_scfind.SCFIND_REQUEST_TIMEOUT


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

    def test_pathway_genes_ubkg_error(self, client, mocker):
        """Test pathway genes when UBKG fetch fails."""
        mocker.patch(
            'app.routes_scfind._fetch_pathway_participants',
            side_effect=Exception('UBKG error'),
        )

        response = client.post('/scfind/pathway-genes', json={'pathway_code': 'R-HSA-99999'})
        assert response.status_code == 500
        data = response.get_json()
        assert 'An error occurred' in data['error']


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
