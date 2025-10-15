import pytest
import requests

from .main import create_app
from .routes_browse import entity_types


@pytest.fixture
def client():
    app = create_app(testing=True)
    # gitignored instance/app.conf should not be read during tests:
    # We should just get the default config.
    assert 'IS_MOCK' not in app.config
    with app.test_client() as client:
        with client.session_transaction() as session:
            session['groups_token'] = '{}'
        yield client


def mock_post_400(path, **kwargs):
    class MockResponse:
        def __init__(self):
            self.status_code = 400
            self.text = 'Logger call requires this'

        def raise_for_status(self):
            raise requests.exceptions.HTTPError(response=self)

    return MockResponse()


def test_400_html_page(client, mocker):
    mocker.patch('requests.post', side_effect=mock_post_400)
    response = client.get('/browse/donor/FAKE')
    assert response.status == '400 BAD REQUEST'


def mock_post_401(path, **kwargs):
    class MockResponse:
        def __init__(self):
            self.status_code = 401
            self.text = 'Logger call requires this'

        def raise_for_status(self):
            raise requests.exceptions.HTTPError(response=self)

    return MockResponse()


def test_401_html_page(client, mocker):
    mocker.patch('requests.post', side_effect=mock_post_401)
    response = client.get('/browse/donor/FAKE')
    assert response.status == '401 UNAUTHORIZED'


@pytest.fixture
def client_not_logged_in():
    app = create_app(testing=True)
    with app.test_client() as client:
        # No groups_token!
        yield client


@pytest.mark.parametrize(
    'path', ['/no-page-here'] + [f'/browse/{t}/fake-uuid.fake' for t in entity_types]
)
def test_404_html_page(client, path):
    response = client.get(path)
    assert response.status == '404 NOT FOUND'


def mock_timeout_post(path, **kwargs):
    raise requests.exceptions.ConnectTimeout()


def test_504_html_page(client, mocker):
    mocker.patch('requests.post', side_effect=mock_timeout_post)
    response = client.get('/browse/donor/FAKE')
    assert response.status == '504 GATEWAY TIMEOUT'
