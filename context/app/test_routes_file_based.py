import pytest

from .main import create_app


@pytest.fixture
def client():
    app = create_app(testing=True)
    with app.test_client() as client:
        yield client


@pytest.mark.parametrize(
    'name,status',
    [('Kidney (Left)', '302 FOUND'), ('Small Intestine', '302 FOUND'),
     ('kidney', '200 OK'), ('small-intestine', '200 OK'),
     ('turtle', '404 NOT FOUND')]
)
def test_organ(client, name, status):
    response = client.get(f'/organ/{name}')
    assert response.status == status
