import pytest

import portal


@pytest.fixture
def client():
    app = portal.create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        with app.app_context():
            pass
            # Do any necessary initializations here.
        yield client


def test_home(client):
    response = client.get('/')
    assert response.status == '200 OK'


def test_browse(client):
    response = client.get('/browse/dataset')
    assert response.status == '200 OK'


def test_details(client):
    response = client.get('/browse/dataset/1')
    assert response.status == '200 OK'


def test_help(client):
    response = client.get('/help')
    assert response.status == '200 OK'


def test_404(client):
    response = client.get('/no-page-here')
    assert response.status == '404 NOT FOUND'


def test_404_browse(client):
    response = client.get('/browse/no-such-type')
    assert response.status == '404 NOT FOUND'
