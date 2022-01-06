import pytest

from .main import create_app


@pytest.fixture
def client():
    app = create_app(testing=True)
    with app.test_client() as client:
        yield client


mock_es = {
    'hits': {
        'total': {'value': 1},
        'hits': [{'_source': {
            'uuid': 'ABC123',
                  'hubmap_id': 'HMB123.XYZ',
                  'mapped_metadata': {
                      'age_unit': ['eons'],
                    'age_value': [42]
                  }
                  }}]
    }
}

mock_tsv = '''uuid\thubmap_id\tage_unit\tage_value\r
#\t\tUnit for age measurement.\tThe time elapsed since birth.\r
ABC123\tHMB123.XYZ\teons\t42\r
'''

def mock_es_post(path, **kwargs):
    class MockResponse():
        def json(self):
            return mock_es
        def raise_for_status(self):
            pass
    return MockResponse()


def tsv_assertions(response):
    assert response.status == '200 OK'
    assert response.get_data(as_text=True) == mock_tsv
    headers = dict(response.headers)
    assert headers['Content-Disposition'].startswith(
        'attachment; filename=hubmap-donors-metadata-')
    assert headers['Content-Type'] == 'text/tab-separated-values; charset=utf-8'


def test_tsv_get(client, mocker):
    mocker.patch('requests.post', side_effect=mock_es_post)
    response = client.get('/metadata/v0/donors.tsv')
    tsv_assertions(response)


def test_tsv_post(client, mocker):
    mocker.patch('requests.post', side_effect=mock_es_post)
    response = client.post('/metadata/v0/donors.tsv', json={'uuids': []})
    tsv_assertions(response)


def test_unexpected_json_tsv_post(client, mocker):
    mocker.patch('requests.post', side_effect=mock_es_post)
    response = client.post('/metadata/v0/donors.tsv', json={'unexpected': []})
    assert response.status == '200 OK' # TODO: Should not be 200!
    assert response.get_data(as_text=True).strip() \
        == '{"message":"POST only accepts uuids in JSON body.","status":400}'


def test_unexpected_args_tsv_post(client, mocker):
    mocker.patch('requests.post', side_effect=mock_es_post)
    response = client.post('/metadata/v0/donors.tsv?hello=world')
    assert response.status == '200 OK'  # TODO: Should not be 200!
    assert response.get_data(as_text=True).strip() \
        == '{"message":"POST only accepts a JSON body.","status":400}'
