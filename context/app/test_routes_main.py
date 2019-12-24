import re
import xml.etree.ElementTree as ET
from xml.etree.ElementTree import ParseError
import json

import pytest

from .main import create_app
from .config import types


@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        with client.session_transaction() as session:
            session['nexus_token'] = '{}'
        yield client


def to_xml(html):
    '''
    Ad-hoc regexes, so we can check for missing or mismatched tags.
    '''
    return re.sub(
        r'(<(meta|link|br)[^>]+)>',
        r'\1/>',
        re.sub(r'<!doctype html>', '', html)
    )


def test_to_xml():
    html = '<!doctype html><html><meta XYZ></html>'
    xml = '<html><meta XYZ/></html>'
    assert to_xml(html) == xml


def mock_get(path, **kwargs):
    class MockResponse():
        def json(self):
            return {
                # Any particular real response would only have one of these.
                'entity_node': {
                    'provenance_create_timestamp': '100000',
                    'provenance_modified_timestamp': '100000',
                },
                'provenance_data': '{"agent": "", "prefix": {}}',
                'uuids': []
            }

        def raise_for_status(self):
            pass
    return MockResponse()


def assert_is_valid_html(response):
    xml = to_xml(response.data.decode('utf8'))
    try:
        ET.fromstring(xml)
    except ParseError as e:
        numbered = '\n'.join([f'{n+1}: {line}' for (n, line) in enumerate(xml.split('\n'))])
        raise Exception(f'{e.msg}\n{numbered}')


@pytest.mark.parametrize(
    'path',
    ['/', '/help']
    + [f'/browse/{t}' for t in types]
    + [f'/browse/{t}/fake-uuid' for t in types]
)
def test_200_html_page(client, path, mocker):
    mocker.patch('requests.get', side_effect=mock_get)
    response = client.get(path)
    assert response.status == '200 OK'
    assert_is_valid_html(response)


@pytest.mark.parametrize(
    'path',
    [f'/browse/{t}/fake-uuid.json' for t in types]
)
def test_200_json_page(client, path, mocker):
    mocker.patch('requests.get', side_effect=mock_get)
    response = client.get(path)
    assert response.status == '200 OK'
    json.loads(response.data.decode('utf8'))




def test_login(client):
    response = client.get('/login')
    assert response.status == '302 FOUND'
    assert response.location.startswith(
        'https://auth.globus.org/v2/oauth2/authorize'
    )
