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
def test_truncate_and_redirect(client, entity_type):
    response = client.post(f'/notebooks/{entity_type}.ipynb', json={'uuids': ['fake-uuid']})
    assert response.status == '200 OK'
