import pytest
from unittest.mock import Mock
from hubmap_api_py_client.errors import ClientError

from .main import create_app
from . import routes_cells


@pytest.fixture
def client():
    app = create_app(testing=True)
    # Set mock config values for cells API
    app.config['XMODALITY_ENDPOINT'] = 'https://mock.cells.api'
    with app.test_client() as client:
        # Clear any cached data before each test
        if hasattr(routes_cells._get_gene_symbols, 'cache_clear'):
            routes_cells._get_gene_symbols.cache_clear()
        if hasattr(routes_cells._get_protein_ids, 'cache_clear'):
            routes_cells._get_protein_ids.cache_clear()
        if hasattr(routes_cells._get_cell_ids, 'cache_clear'):
            routes_cells._get_cell_ids.cache_clear()
        if hasattr(routes_cells._get_all_labels, 'cache_clear'):
            routes_cells._get_all_labels.cache_clear()
        if hasattr(routes_cells.translate_clid, 'cache_clear'):
            routes_cells.translate_clid.cache_clear()
        if hasattr(routes_cells.translate_label, 'cache_clear'):
            routes_cells.translate_label.cache_clear()
        if hasattr(routes_cells._get_all_names_for_clid, 'cache_clear'):
            routes_cells._get_all_names_for_clid.cache_clear()

        # Clear the invalid genes cache
        routes_cells._INVALID_GENES_CACHE.clear()

        yield client


# Mock data for various API responses
mock_gene_symbols = ['ACTB', 'GAPDH', 'TP53', 'MYC', 'EGFR', 'BRCA1', 'BRCA2']
mock_protein_ids = ['P60709', 'P04406', 'P04637', 'P01106', 'P00533']
mock_cell_labels = [
    {
        'Organ_Level': 'kidney',
        'A_L': 'kidney_1',
        'A_ID': 'azimuth_1',
        'Label': 'epithelial cell',
        'CL_ID': 'CL:0000066',
        'CL_Match': '1',
        'Lookup_Label': 'epithelial cell (CL:0000066)'
    },
    {
        'Organ_Level': 'heart',
        'A_L': 'heart_1',
        'A_ID': 'azimuth_2',
        'Label': 'cardiomyocyte',
        'CL_ID': 'CL:0000746',
        'CL_Match': '1',
        'Lookup_Label': 'cardiomyocyte (CL:0000746)'
    }
]
mock_dataset_results = [
    {'uuid': 'dataset1', 'title': 'Test Dataset 1'},
    {'uuid': 'dataset2', 'title': 'Test Dataset 2'}
]


def create_mock_client():
    """Create a mock HubMAP API client."""
    mock_client = Mock()

    # Mock gene selection
    mock_genes = Mock()
    mock_genes.get_list.return_value = [
        {'gene_symbol': symbol} for symbol in mock_gene_symbols
    ]
    mock_client.select_genes.return_value = mock_genes

    # Mock protein selection
    mock_proteins = Mock()
    mock_proteins.get_list.return_value = [
        {'protein_id': protein_id} for protein_id in mock_protein_ids
    ]
    mock_client.select_proteins.return_value = mock_proteins

    # Mock cell type selection
    mock_celltypes = Mock()
    mock_celltypes.get_list.return_value = [
        {'grouping_name': label['CL_ID']} for label in mock_cell_labels
    ]
    mock_client.select_celltypes.return_value = mock_celltypes

    # Mock dataset selection
    mock_datasets = Mock()
    mock_datasets.get_list.return_value = mock_dataset_results
    mock_datasets.__len__ = Mock(return_value=len(mock_dataset_results))
    mock_client.select_datasets.return_value = mock_datasets

    # Mock cells selection
    mock_cells = Mock()
    mock_cells.get_list.return_value = [
        {
            'cell_type': 'CL:0000066',
            'clusters': ['cluster-method-a-1'],
            'values': {'ACTB': 15.0},
            'modality': 'rna'
        }
    ]
    mock_client.select_cells.return_value = mock_cells

    return mock_client


class TestCellsUIRoutes:
    """Test class for UI route endpoints."""

    def test_cells_ui(self, client):
        """Test the biomarkers-cell-types UI route."""
        response = client.get('/search/biomarkers-cell-types')
        assert response.status_code == 200
        assert b'Biomarker and Cell Type Search' in response.data

    def test_cells_redirect(self, client):
        """Test the cells redirect route."""
        response = client.get('/cells')
        assert response.status_code == 301
        assert '/search/biomarkers-cell-types' in response.location

    def test_biomarkers_ui(self, client):
        """Test the biomarkers UI route."""
        response = client.get('/biomarkers')
        assert response.status_code == 200
        assert b'Biomarkers' in response.data


class TestCellsAutocompleteRoutes:
    """Test class for autocomplete endpoints."""

    def test_genes_by_substring_success(self, client, mocker):
        """Test successful gene substring search."""
        mocker.patch('app.routes_cells._get_gene_symbols',
                     return_value=mock_gene_symbols)

        response = client.post('/cells/genes-by-substring.json?substring=BRC')
        assert response.status_code == 200
        data = response.get_json()
        assert 'results' in data
        assert isinstance(data['results'], list)

    def test_genes_by_substring_empty_query(self, client, mocker):
        """Test gene substring search with empty query."""
        mocker.patch('app.routes_cells._get_gene_symbols',
                     return_value=mock_gene_symbols)

        response = client.post('/cells/genes-by-substring.json?substring=')
        assert response.status_code == 200
        data = response.get_json()
        # Empty substring matches all genes up to the limit
        assert len(data['results']) == len(mock_gene_symbols)

    def test_proteins_by_substring_success(self, client, mocker):
        """Test successful protein substring search."""
        mocker.patch('app.routes_cells._get_protein_ids',
                     return_value=mock_protein_ids)

        response = client.post('/cells/proteins-by-substring.json?substring=P04')
        assert response.status_code == 200
        data = response.get_json()
        assert 'results' in data
        assert isinstance(data['results'], list)

    def test_proteins_by_substring_empty_query(self, client, mocker):
        """Test protein substring search with empty query."""
        mocker.patch('app.routes_cells._get_protein_ids',
                     return_value=mock_protein_ids)

        response = client.post('/cells/proteins-by-substring.json?substring=')
        assert response.status_code == 200
        data = response.get_json()
        # Empty substring matches all proteins up to the limit
        assert len(data['results']) == len(mock_protein_ids)

    def test_cell_types_by_substring_success(self, client, mocker):
        """Test successful cell type substring search."""
        mocker.patch('app.routes_cells._get_cell_ids',
                     return_value=mock_cell_labels)

        response = client.post('/cells/cell-types-by-substring.json?substring=epithelial')
        assert response.status_code == 200
        data = response.get_json()
        assert 'results' in data
        assert isinstance(data['results'], list)

    def test_cell_types_by_substring_empty_query(self, client, mocker):
        """Test cell type substring search with empty query."""
        mocker.patch('app.routes_cells._get_cell_ids',
                     return_value=mock_cell_labels)

        response = client.post('/cells/cell-types-by-substring.json?substring=')
        assert response.status_code == 200
        data = response.get_json()
        # Empty substring matches all cell types up to the limit
        assert len(data['results']) == len(mock_cell_labels)


class TestGenesValidate:
    """Test class for genes validation endpoint."""

    def test_genes_validate_success(self, client, mocker):
        """Test successful gene validation."""
        # Mock the gene symbols function
        mocker.patch('app.routes_cells._get_gene_symbols',
                     return_value=mock_gene_symbols)

        # Mock the client and its methods
        mock_client = create_mock_client()
        mocker.patch('app.routes_cells._get_client', return_value=mock_client)

        test_genes = ['ACTB', 'GAPDH', 'INVALID_GENE', 'TP53']
        response = client.post('/cells/genes/validate',
                               json={'genes': test_genes, 'modality': 'rna'})

        assert response.status_code == 200
        data = response.get_json()
        assert 'valid_genes' in data
        assert 'invalid_genes' in data
        assert 'total_provided' in data
        assert 'total_valid' in data
        assert data['total_provided'] == len(test_genes)

    def test_genes_validate_default_modality(self, client, mocker):
        """Test gene validation with default modality."""
        mocker.patch('app.routes_cells._get_gene_symbols',
                     return_value=mock_gene_symbols)

        mock_client = create_mock_client()
        mocker.patch('app.routes_cells._get_client', return_value=mock_client)

        test_genes = ['ACTB', 'GAPDH']
        response = client.post('/cells/genes/validate',
                               json={'genes': test_genes})  # No modality specified

        assert response.status_code == 200
        data = response.get_json()
        assert data['total_provided'] == 2

    def test_genes_validate_client_error(self, client, mocker):
        """Test gene validation with client error."""
        mocker.patch('app.routes_cells._get_gene_symbols',
                     return_value=mock_gene_symbols)

        # Mock client that raises ClientError
        mock_client = Mock()
        mock_client.select_datasets.side_effect = ClientError("Gene not found in index")
        mocker.patch('app.routes_cells._get_client', return_value=mock_client)

        test_genes = ['INVALID_GENE']
        response = client.post('/cells/genes/validate',
                               json={'genes': test_genes, 'modality': 'rna'})

        assert response.status_code == 200
        data = response.get_json()
        assert 'invalid_genes' in data
        assert 'INVALID_GENE' in data['invalid_genes']

    def test_genes_validate_missing_json(self, client):
        """Test gene validation without JSON content type."""
        response = client.post('/cells/genes/validate', data='not json')
        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data
        assert data['error'] == 'Request must be JSON'

    def test_genes_validate_missing_genes_key(self, client):
        """Test gene validation without 'genes' key in request."""
        response = client.post('/cells/genes/validate', json={'invalid_key': []})
        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data
        assert data['error'] == 'Missing "genes" array in request body'

    def test_genes_validate_invalid_genes_type(self, client):
        """Test gene validation with invalid genes data type."""
        response = client.post('/cells/genes/validate', json={'genes': 'not_a_list'})
        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data
        assert data['error'] == '"genes" must be an array'

    def test_genes_validate_error_handling(self, client, mocker):
        """Test gene validation error handling."""
        mocker.patch('app.routes_cells._get_gene_symbols',
                     side_effect=Exception("API error"))

        response = client.post('/cells/genes/validate', json={'genes': ['ACTB']})
        assert response.status_code == 500
        data = response.get_json()
        assert 'error' in data
        assert data['error'] == 'Failed to validate genes'


class TestDatasetsEndpoints:
    """Test class for dataset-related endpoints."""

    def test_datasets_selected_by_gene_success(self, client, mocker):
        """Test datasets selected by gene."""
        mock_client = create_mock_client()
        mocker.patch('app.routes_cells._get_client', return_value=mock_client)

        response = client.post('/cells/datasets-selected-by-gene.json'
                               '?cell_variable_name=ACTB&modality=rna'
                               '&min_expression=5&min_cell_percentage=0.1')

        assert response.status_code == 200
        data = response.get_json()
        assert 'results' in data

    def test_datasets_selected_by_cell_type_success(self, client, mocker):
        """Test datasets selected by cell type."""
        mock_client = create_mock_client()
        mocker.patch('app.routes_cells._get_client', return_value=mock_client)
        mocker.patch('app.routes_cells.translate_label', return_value='CL:0000066')

        response = client.post('/cells/datasets-selected-by-cell-type.json'
                               '?cell_variable_name=epithelial%20cell')

        assert response.status_code == 200
        data = response.get_json()
        assert 'results' in data

    def test_datasets_selected_client_error(self, client, mocker):
        """Test datasets endpoint with client error."""
        mock_client = Mock()
        mock_client.select_datasets.side_effect = ClientError("API error")
        mocker.patch('app.routes_cells._get_client', return_value=mock_client)

        response = client.post('/cells/datasets-selected-by-gene.json'
                               '?cell_variable_name=INVALID&modality=rna'
                               '&min_expression=5&min_cell_percentage=0.1')

        assert response.status_code == 200
        data = response.get_json()
        assert 'message' in data

    def test_cell_percentages_for_datasets(self, client, mocker):
        """Test cell percentages for datasets endpoint."""
        mock_client = create_mock_client()
        mocker.patch('app.routes_cells._get_client', return_value=mock_client)

        response = client.post('/cells/cell-percentages-for-datasets.json'
                               '?uuid=dataset1&gene_name=ACTB&min_gene_expression=5')

        assert response.status_code == 200
        data = response.get_json()
        assert 'results' in data

    def test_cell_expression_in_dataset(self, client, mocker):
        """Test cell expression in dataset endpoint."""
        mock_client = create_mock_client()
        mocker.patch('app.routes_cells._get_client', return_value=mock_client)
        mocker.patch('app.routes_cells.translate_clid', return_value='epithelial cell')

        response = client.post('/cells/cell-expression-in-dataset.json'
                               '?uuid=dataset1&cell_variable_names=ACTB')

        assert response.status_code == 200
        data = response.get_json()
        assert 'results' in data

    def test_all_indexed_uuids(self, client, mocker):
        """Test all indexed UUIDs endpoint."""
        mock_client = create_mock_client()
        mocker.patch('app.routes_cells._get_client', return_value=mock_client)

        response = client.post('/cells/all-indexed-uuids.json')

        assert response.status_code == 200
        data = response.get_json()
        assert 'results' in data

    def test_cells_in_dataset_clusters(self, client, mocker):
        """Test cells in dataset clusters endpoint."""
        mock_client = create_mock_client()
        mocker.patch('app.routes_cells._get_client', return_value=mock_client)

        response = client.post('/cells/cells-in-dataset-clusters.json'
                               '?uuid=dataset1&cell_variable_name=ACTB&min_expression=5')

        assert response.status_code == 200
        data = response.get_json()
        assert 'results' in data

    def test_total_datasets_get(self, client, mocker):
        """Test total datasets GET endpoint."""
        mock_client = create_mock_client()
        mocker.patch('app.routes_cells._get_client', return_value=mock_client)

        response = client.get('/cells/total-datasets.json')

        assert response.status_code == 200
        data = response.get_json()
        assert 'results' in data


class TestCellTypeUtilities:
    """Test class for cell type utility endpoints."""

    def test_all_names_for_cell_type(self, client, mocker):
        """Test getting all names for a cell type."""
        mocker.patch('app.routes_cells.translate_label', return_value='CL:0000066')
        mocker.patch('app.routes_cells._get_all_names_for_clid',
                     return_value=['epithelial cell', 'epithelium'])

        response = client.post('/cells/all-names-for-cell-type.json'
                               '?cell_type=epithelial%20cell')

        assert response.status_code == 200
        data = response.get_json()
        assert 'results' in data
        assert isinstance(data['results'], list)


class TestUtilityFunctions:
    """Test class for utility functions."""

    def test_get_cluster_name_and_number(self):
        """Test cluster name and number parsing."""
        cluster = routes_cells._get_cluster_name_and_number('cluster-method-a-1')
        assert cluster.name == 'cluster-method-a'
        assert cluster.number == '1'

    def test_get_cluster_cells(self, client):
        """Test cluster cells processing."""
        cells = [
            {
                "clusters": ["cluster-method-a-1", "cluster-method-b-1"],
                "values": {"VIM": 21.0}
            },
            {
                "clusters": ["cluster-method-a-1"],
                "values": {"VIM": 7.0}
            }
        ]

        with client.application.test_request_context('/test'):
            result = routes_cells._get_cluster_cells(
                cells=cells, cell_variable_name='VIM', min_expression=10
            )

        assert len(result) == 3
        assert all('cluster_name' in cell for cell in result)
        assert all('meets_minimum_expression' in cell for cell in result)

    def test_get_matched_cell_counts_per_cluster(self, client):
        """Test matched cell counts per cluster."""
        cells = [
            {
                'modality': 'rna',
                'cluster_name': 'cluster-method-a',
                'cluster_number': '1',
                'meets_minimum_expression': True
            },
            {
                'modality': 'rna',
                'cluster_name': 'cluster-method-a',
                'cluster_number': '1',
                'meets_minimum_expression': False
            }
        ]

        with client.application.test_request_context('/test'):
            result = routes_cells._get_matched_cell_counts_per_cluster(cells)

        assert 'cluster-method-a' in result
        cluster_data = result['cluster-method-a'][0]
        assert cluster_data['matched'] == 1
        assert cluster_data['unmatched'] == 1

    def test_invalid_genes_cache_functions(self):
        """Test invalid genes cache utility functions."""
        # Clear cache
        routes_cells._INVALID_GENES_CACHE.clear()

        # Test adding and checking
        routes_cells._add_invalid_gene_to_cache('INVALID_GENE', 'rna')
        assert routes_cells._is_gene_cached_as_invalid('INVALID_GENE', 'rna')
        assert not routes_cells._is_gene_cached_as_invalid('VALID_GENE', 'rna')

        # Test filtering
        genes = ['VALID_GENE', 'INVALID_GENE', 'ANOTHER_GENE']
        to_test, invalid = routes_cells._filter_genes_by_cache(genes, 'rna')

        assert 'INVALID_GENE' in invalid
        assert 'VALID_GENE' in to_test
        assert 'ANOTHER_GENE' in to_test

        # Test cache stats
        stats = routes_cells._get_cache_stats()
        assert 'rna' in stats
        assert stats['rna'] == 1


class TestTranslationFunctions:
    """Test class for translation utility functions."""

    def test_translate_clid(self, client, mocker):
        """Test CLID to label translation."""
        mocker.patch('app.routes_cells._get_cell_ids',
                     return_value=mock_cell_labels)

        result = routes_cells.translate_clid('CL:0000066')
        assert result == 'epithelial cell'

    def test_translate_label(self, client, mocker):
        """Test label to CLID translation."""
        mocker.patch('app.routes_cells._get_cell_ids',
                     return_value=mock_cell_labels)

        result = routes_cells.translate_label('epithelial cell')
        assert result == 'CL:0000066'

    def test_translate_lookup_label(self, client, mocker):
        """Test lookup label to CLID translation."""
        mocker.patch('app.routes_cells._get_cell_ids',
                     return_value=mock_cell_labels)

        result = routes_cells.translate_label('epithelial cell (CL:0000066)')
        assert result == 'CL:0000066'

    def test_get_all_names_for_clid(self, client, mocker):
        """Test getting all names for a CLID."""
        mock_all_labels = [
            {'Label': 'epithelial cell', 'CL_ID': 'CL:0000066'},
            {'Label': 'epithelium', 'CL_ID': 'CL:0000066'},
            {'Label': 'cardiomyocyte', 'CL_ID': 'CL:0000746'}
        ]
        mocker.patch('app.routes_cells._get_all_labels',
                     return_value=mock_all_labels)

        result = routes_cells._get_all_names_for_clid('CL:0000066')
        assert isinstance(result, tuple)
        assert 'epithelial cell' in result
        assert 'epithelium' in result
        assert 'cardiomyocyte' not in result


@pytest.mark.parametrize(
    'endpoint,method,expected_status',
    [
        ('/search/biomarkers-cell-types', 'GET', 200),
        ('/cells', 'GET', 301),  # Redirect
        ('/biomarkers', 'GET', 200),
        ('/cells/genes-by-substring.json', 'POST', 200),
        ('/cells/proteins-by-substring.json', 'POST', 200),
        ('/cells/cell-types-by-substring.json', 'POST', 200),
        ('/cells/genes/validate', 'POST', 400),  # No JSON body
        ('/cells/cell-percentages-for-datasets.json', 'POST', 200),
        ('/cells/cell-expression-in-dataset.json', 'POST', 200),
        ('/cells/all-indexed-uuids.json', 'POST', 200),
        ('/cells/cells-in-dataset-clusters.json', 'POST', 200),
        ('/cells/all-names-for-cell-type.json', 'POST', 200),
        ('/cells/total-datasets.json', 'GET', 200),
    ]
)
def test_endpoint_accessibility(client, mocker, endpoint, method, expected_status):
    """Test that all endpoints are accessible and return expected status codes."""
    # Mock the necessary functions
    mocker.patch('app.routes_cells._get_gene_symbols', return_value=mock_gene_symbols)
    mocker.patch('app.routes_cells._get_protein_ids', return_value=mock_protein_ids)
    mocker.patch('app.routes_cells._get_cell_ids', return_value=mock_cell_labels)

    mock_client = create_mock_client()
    mocker.patch('app.routes_cells._get_client', return_value=mock_client)
    mocker.patch('app.routes_cells.translate_label', return_value='CL:0000066')
    mocker.patch('app.routes_cells.translate_clid', return_value='epithelial cell')
    mocker.patch('app.routes_cells._get_all_names_for_clid', return_value=['epithelial cell'])

    if method == 'GET':
        response = client.get(endpoint)
    else:  # POST
        # Add necessary query parameters for POST endpoints that need them
        if 'by-substring' in endpoint:
            endpoint += '?substring=test'
        elif 'cells-in-dataset-clusters' in endpoint:
            endpoint += '?uuid=test-uuid&cell_variable_name=ACTB&min_expression=5'
        elif 'cell-percentages-for-datasets' in endpoint:
            endpoint += '?uuid=test-uuid&gene_name=ACTB&min_gene_expression=5'
        elif 'cell-expression-in-dataset' in endpoint:
            endpoint += '?uuid=test-uuid&cell_variable_names=ACTB'
        elif 'all-names-for-cell-type' in endpoint:
            endpoint += '?cell_type=epithelial%20cell'
        response = client.post(endpoint)

    assert response.status_code == expected_status
