import pytest

from .main import create_app


@pytest.fixture
def client():
    app = create_app(testing=True)
    with app.test_client() as client:
        yield client


# Just one example from context/app/api/vitessce_confs/fixtures/:
mock_entity = {
    "data_types": ["salmon_rnaseq_10x"],
    "files": [
        {"rel_path": "cluster-marker-genes/output/cluster_marker_genes.cells.json"},
        {"rel_path": "cluster-marker-genes/output/cluster_marker_genes.cell-sets.json"}
    ],
    "mapped_data_types": [],
    "metadata": {"dag_provenance_list": []},
    "status": "Published",
    "uuid": "based on ea4cfecb8495b36694d9a951510dc3c6"
}
mock_es = {
    "hits": {
        "hits": [{"_source": mock_entity}]
    }
}


def mock_es_post(path, **kwargs):
    class MockResponse():
        def json(self):
            return mock_es

        def raise_for_status(self):
            pass
    return MockResponse()


def test_details_vitessce(client, mocker):
    mocker.patch('requests.post', side_effect=mock_es_post)
    response = client.get('/browse/dataset/0123456789abcdef0123456789abcdef.vitessce.json')
    assert response.status == '200 OK'
    headers = dict(response.headers)
    assert headers['Access-Control-Allow-Origin'] == '*'

