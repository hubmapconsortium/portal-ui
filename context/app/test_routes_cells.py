import pytest

from .main import create_app
from . import routes_cells
from . import utils as app_utils


@pytest.fixture
def client():
    app = create_app(testing=True)
    with app.test_client() as client:
        # Clear any cached data before each test
        if hasattr(app_utils.fetch_pathway_participants, 'cache_clear'):
            app_utils.fetch_pathway_participants.cache_clear()
        if hasattr(routes_cells._get_scfind_gene_sets, 'cache_clear'):
            routes_cells._get_scfind_gene_sets.cache_clear()

        yield client


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


class TestBiomarkersGenesInfo:
    """Test class for the /biomarkers/genes-info.json endpoint."""

    mock_ubkg_response = {
        'genes': [
            {'approved_name': 'Actin Beta', 'approved_symbol': 'ACTB', 'summary': 'A gene.'},
            {
                'approved_name': 'Tumor Protein P53',
                'approved_symbol': 'TP53',
                'summary': 'Another gene.',
            },
            {'approved_name': 'Unknown Gene', 'approved_symbol': 'ZZZZZ', 'summary': ''},
        ],
        'pagination': {
            'items_per_page': 10,
            'page': 1,
            'total_pages': 1,
            'starts_with': '',
            'item_count': 3,
        },
    }

    def test_genes_info_success(self, client, mocker):
        """Test successful gene list with modality enrichment."""
        mock_response = mocker.Mock()
        mock_response.json.return_value = self.mock_ubkg_response
        mock_response.raise_for_status.return_value = None
        mocker.patch('app.routes_cells.http_requests.get', return_value=mock_response)
        mocker.patch(
            'app.routes_cells._get_scfind_gene_sets',
            return_value=({'ACTB', 'TP53'}, {'ACTB'}),
        )

        def fake_dataset_counts(genes, modality=None):
            base = {'ACTB': 2} if modality == 'ATAC' else {'ACTB': 5, 'TP53': 3}
            return {gene: base.get(gene, 0) for gene in genes}

        mocker.patch(
            'app.routes_scfind._dataset_counts_for_genes', side_effect=fake_dataset_counts
        )

        response = client.get('/biomarkers/genes-info.json?starts_with=A&page=1')
        assert response.status_code == 200
        data = response.get_json()
        assert len(data['genes']) == 3

        actb = data['genes'][0]
        assert actb['has_scfind_rna'] is True
        assert actb['has_scfind_atac'] is True
        assert actb['scfind_rna_dataset_count'] == 5
        assert actb['scfind_atac_dataset_count'] == 2

        tp53 = data['genes'][1]
        assert tp53['has_scfind_rna'] is True
        assert tp53['has_scfind_atac'] is False
        assert tp53['scfind_rna_dataset_count'] == 3
        assert tp53['scfind_atac_dataset_count'] == 0

        zzzzz = data['genes'][2]
        assert zzzzz['has_scfind_rna'] is False
        assert zzzzz['has_scfind_atac'] is False
        assert zzzzz['scfind_rna_dataset_count'] == 0
        assert zzzzz['scfind_atac_dataset_count'] == 0

        assert 'pagination' in data

    def test_genes_info_ubkg_timeout(self, client, mocker):
        """Test UBKG timeout returns 504."""
        import requests

        mocker.patch(
            'app.routes_cells.http_requests.get',
            side_effect=requests.exceptions.Timeout('timed out'),
        )

        response = client.get('/biomarkers/genes-info.json?starts_with=A&page=1')
        assert response.status_code == 504
        data = response.get_json()
        assert 'error' in data

    def test_genes_info_ubkg_error(self, client, mocker):
        """Test UBKG request error returns 502."""
        import requests

        mocker.patch(
            'app.routes_cells.http_requests.get',
            side_effect=requests.exceptions.ConnectionError('connection refused'),
        )

        response = client.get('/biomarkers/genes-info.json?starts_with=A&page=1')
        assert response.status_code == 502
        data = response.get_json()
        assert 'error' in data

    def test_genes_info_scfind_failure_graceful(self, client, mocker):
        """Test graceful degradation when scFind gene sets fail to load."""
        mock_response = mocker.Mock()
        mock_response.json.return_value = self.mock_ubkg_response
        mock_response.raise_for_status.return_value = None
        mocker.patch('app.routes_cells.http_requests.get', return_value=mock_response)
        mocker.patch(
            'app.routes_cells._get_scfind_gene_sets',
            side_effect=Exception('scFind unavailable'),
        )

        response = client.get('/biomarkers/genes-info.json?starts_with=A&page=1')
        assert response.status_code == 200
        data = response.get_json()
        assert len(data['genes']) == 3
        for gene in data['genes']:
            assert gene['has_scfind_rna'] is None
            assert gene['has_scfind_atac'] is None


@pytest.mark.parametrize(
    'endpoint,method,expected_status',
    [
        ('/search/biomarkers-cell-types', 'GET', 200),
        ('/cells', 'GET', 301),  # Redirect
        ('/biomarkers', 'GET', 200),
        ('/biomarkers/genes-info.json', 'GET', 502),  # No UBKG mock
    ],
)
def test_endpoint_accessibility(client, endpoint, method, expected_status):
    """Test that all endpoints are accessible and return expected status codes."""
    if method == 'GET':
        response = client.get(endpoint)
    else:  # POST
        response = client.post(endpoint)

    assert response.status_code == expected_status
