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


@pytest.mark.parametrize('path', [
    '/',
    '/browse/dataset',
    '/browse/dataset/1',
    '/help'
])
def test_200_page(client, path):
    response = client.get(path)
    assert response.status == '200 OK'


@pytest.mark.parametrize('path', [
    '/no-page-here',
    '/browse/no-such-type'
])
def test_404_page(client, path):
    response = client.get(path)
    assert response.status == '404 NOT FOUND'


def test_login(client):
    response = client.get('/auth/login')
    assert response.status == '302 FOUND'
    assert response.location.startswith(
        'https://auth.globus.org/v2/oauth2/authorize'
    )
