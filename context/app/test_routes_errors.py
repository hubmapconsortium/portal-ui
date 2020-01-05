import pytest
import requests

from .main import create_app
from .config import types
from .test_routes_main import assert_is_valid_html


@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        with client.session_transaction() as session:
            session['nexus_token'] = '{}'
        yield client


def mock_get_400(path, **kwargs):
    class MockResponse():
        def __init__(self):
            self.status_code = 400
            self.text = 'Logger call requires this'

        def raise_for_status(self):
            raise requests.exceptions.HTTPError(response=self)
    return MockResponse()

# TODO: https://github.com/hubmapconsortium/portal-ui/issues/102
# def test_400_html_page(client, mocker):
#     mocker.patch('requests.get', side_effect=mock_get_400)
#     response = client.get('/browse/donor')
#     assert response.status == '400 BAD REQUEST'
#     assert_is_valid_html(response)
#     assert '400: Bad Request' in response.data.decode('utf8')


@pytest.fixture
def client_not_logged_in():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        # No nexus_token!
        yield client

# TODO: https://github.com/hubmapconsortium/portal-ui/issues/102
# def test_403_html_page(client_not_logged_in):
#     response = client_not_logged_in.get('/browse/donor')
#     assert response.status == '403 FORBIDDEN'
#     assert_is_valid_html(response)
#     assert '403: Access Denied' in response.data.decode('utf8')


@pytest.mark.parametrize('path', [
    '/no-page-here',
    '/browse/no-such-type']
    + [f'/browse/{t}/fake-uuid.fake' for t in types]
)
def test_404_html_page(client, path):
    response = client.get(path)
    assert response.status == '404 NOT FOUND'
    assert_is_valid_html(response)
    assert '404: Not Found' in response.data.decode('utf8')


def mock_timeout_get(path, **kwargs):
    raise requests.exceptions.ConnectTimeout()

# TODO: https://github.com/hubmapconsortium/portal-ui/issues/102
# def test_504_html_page(client, mocker):
#     mocker.patch('requests.get', side_effect=mock_timeout_get)
#     response = client.get('/browse/donor')
#     assert response.status == '504 GATEWAY TIMEOUT'
#     assert_is_valid_html(response)
#     assert '504: Gateway Timeout' in response.data.decode('utf8')
