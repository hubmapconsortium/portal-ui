import pytest

from .main import create_app


@pytest.fixture
def client():
    app = create_app(testing=True)
    with app.test_client() as client:
        yield client


def mock_es_post(path, **kwargs):
    class MockResponse():
        def json(self):
            return {
              'hits': {
                'total': {'value': 1},
                'hits': [{'_source':{}}]
              }
            }
        def raise_for_status(self):
            pass
    return MockResponse()


def test_tsv_get(client, mocker):
    mocker.patch('requests.post', side_effect=mock_es_post)
    response = client.get('/metadata/v0/donors.tsv')
    assert response.status == '200 OK'
