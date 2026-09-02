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
        'hits': [
            {
                '_source': {
                    'uuid': 'ABC123',
                    'hubmap_id': 'HMB123.XYZ',
                    'mapped_metadata': {'age_unit': ['eons'], 'age_value': [42]},
                }
            }
        ],
    }
}

mock_ontology_descriptions = [
    {
        'name': 'age_unit',
        'descriptions': [{'description': 'Unit for age measurement.', 'source': 'HMFIELD'}],
    },
    {
        'name': 'age_value',
        'descriptions': [{'description': 'The time elapsed since birth.', 'source': 'HMFIELD'}],
    },
]

mock_ontology_field_types = [
    {
        'name': 'age_unit',
        'code_ids': ['HMFIELD:1235'],
        'types': [{'mapping_source': 'HMFIELD', 'type': 'string', 'type_source': 'HMFIELD'}],
    },
    {
        'name': 'age_value',
        'code_ids': ['HMFIELD:1234'],
        'types': [
            {'mapping_source': 'HMFIELD', 'type': 'number', 'type_source': 'HMFIELD'},
            {'mapping_source': 'HMFIELD', 'type': 'float', 'type_source': 'XSD'},
        ],
    },
]

tab = '\t'
extra_fields = [
    'created_by_user_displayname',
    'created_by_user_email',
    'created_timestamp',
    'data_access_level',
    'group_name',
    'last_modified_timestamp',
    'mapped_consortium',
    'mapped_status',
    'published_timestamp',
    'status',
]
mock_tsv = f"""uuid\thubmap_id\tage_unit\tage_value\t{tab.join(extra_fields)}\r
#\t\tUnit for age measurement.\tThe time elapsed since birth.{len(extra_fields) * tab}\r
ABC123\tHMB123.XYZ\teons\t42{len(extra_fields) * tab}\r
"""


def mock_es_post(path, **kwargs):
    class MockResponse:
        def __init__(self):
            self.status_code = 0  # _request requires a status code
            self.text = 'Logger call requires this'

        def json(self):
            return mock_es

        def raise_for_status(self):
            pass

    return MockResponse()


def mock_es_get(path, **kwargs):
    if 'field-types' in path:
        data = mock_ontology_field_types
    else:
        data = mock_ontology_descriptions

    class MockResponse:
        def __init__(self):
            self.status_code = 0  # _request requires a status code
            self.text = 'Logger call requires this'

        def json(self):
            return data

        def raise_for_status(self):
            pass

    return MockResponse()


def tsv_assertions(response):
    assert response.status == '200 OK'
    assert response.get_data(as_text=True) == mock_tsv
    headers = dict(response.headers)
    assert headers['Content-Disposition'].startswith(
        'attachment; filename=hubmap-donors-metadata-'
    )
    assert headers['Content-Type'] == 'text/tab-separated-values; charset=utf-8'


def test_tsv_get(client, mocker):
    mocker.patch('requests.post', side_effect=mock_es_post)
    mocker.patch('requests.get', side_effect=mock_es_get)
    response = client.get('/metadata/v0/donors.tsv')
    tsv_assertions(response)


def test_tsv_post(client, mocker):
    mocker.patch('requests.post', side_effect=mock_es_post)
    mocker.patch('requests.get', side_effect=mock_es_get)
    response = client.post('/metadata/v0/donors.tsv', json={'uuids': []})
    tsv_assertions(response)


def test_unexpected_json_tsv_post(client, mocker):
    mocker.patch('requests.post', side_effect=mock_es_post)
    response = client.post('/metadata/v0/donors.tsv', json={'unexpected': []})
    assert response.status == '200 OK'  # TODO: Should not be 200!
    # https://github.com/hubmapconsortium/portal-ui/issues/2348
    assert (
        response.get_data(as_text=True).strip()
        == '{"message":"POST only accepts uuids in JSON body.","status":400}'
    )


def test_unexpected_args_tsv_post(client, mocker):
    mocker.patch('requests.post', side_effect=mock_es_post)
    response = client.post('/metadata/v0/donors.tsv?hello=world')
    assert response.status == '200 OK'  # TODO: Should not be 200!
    # https://github.com/hubmapconsortium/portal-ui/issues/2348
    assert (
        response.get_data(as_text=True).strip()
        == '{"message":"POST only accepts a JSON body.","status":400}'
    )
