import pytest

from .main import create_app


@pytest.fixture
def client():
    app = create_app(testing=True)
    with app.test_client() as client:
        yield client


@pytest.mark.parametrize(
    'entity_type',
    ['donors', 'samples', 'datasets']
)
def test_notebook(client, entity_type, mocker):
    mocker.patch('portal_visualization.client.ApiClient.get_files')
    response = client.post(
        f'/notebooks/entities/{entity_type}.ipynb', json={'uuids': ['fake-uuid']})
    assert response.status == '200 OK'
