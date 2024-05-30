import pytest

from .main import create_app


@pytest.fixture
def client():
    app = create_app(testing=True)
    with app.test_client() as client:
        yield client


@pytest.mark.parametrize(
    'name,status',
    [('Kidney (Left)', '200 OK'),  # We now strip the (Left) part
     ('Small Intestine', '200 OK'),
     ('kidney', '200 OK'),
     ('small-intestine', '200 OK'),
     ('turtle', '308 PERMANENT REDIRECT'),
     ('doggo', '308 PERMANENT REDIRECT'),
     ('Placenta', '200 OK'),
     ('PLACENTA', '200 OK'),
     ('Blood Vasculature', '200 OK'),
     ('Blood_vasculature', '200 OK'),
     ('   PlAcEntA    ', '200 OK')]
)
def test_organ(client, name, status):
    response = client.get(f'/organ/{name}')
    assert response.status == status


@pytest.mark.parametrize(
    'name,expected',
    [('kidney', 'Kidney'),
     ('small-intestine', 'Small Intestine'),
     ('placenta', 'Placenta'),
     ('blood-vasculature', 'Blood Vasculature'),
     ('blah', None)]
)
def test_get_organ_details(client, name, expected):
    response = client.get(f'/organ/{name}.json')
    if expected is not None:
        assert response.json.get('name') == expected
    else:
        assert response.json == {}


@pytest.mark.parametrize(
    'organs,expected',
    [(['kidney'], ['kidney']),
     (['kidney', 'blah'], ['kidney']),
     (['kidney', 'heart', 'blah'], ['heart', 'kidney'])]
)
def test_get_organ_list(client, organs, expected):
    response = client.post('/organs.json', json={'organs': organs})
    assert list(response.json.keys()) == expected
