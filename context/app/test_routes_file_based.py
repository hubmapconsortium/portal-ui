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
     ('turtle', '302 FOUND'), ('', '302 FOUND'),
     ('Placenta', '200 OK'), ('PLACENTA', '200 OK'),
     ('Blood Vasculature', '200 OK'), ('Blood_vasculature', '200 OK'),
     ('   PlAcEntA    ', '200 OK')]
)
def test_organ(client, name, status):
    response = client.get(f'/organ/{name}')
    assert response.status == status
