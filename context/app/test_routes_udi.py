import pytest

from . import routes_udi
from .main import create_app


@pytest.fixture
def client():
    app = create_app(testing=True)
    with app.test_client() as client:
        yield client


@pytest.fixture(autouse=True)
def _reset_udi_orchestrator_cache():
    # Orchestrators are cached at module level; clear between tests so each
    # test sees a fresh build against its own config/session state.
    routes_udi._udi_orchestrator_hubmap = None
    routes_udi._udi_orchestrator_byok = None
    yield
    routes_udi._udi_orchestrator_hubmap = None
    routes_udi._udi_orchestrator_byok = None


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


def test_datapackage(client, mocker):
    mocker.patch('requests.post', side_effect=mock_es_post)
    mocker.patch('requests.get', side_effect=mock_es_get)
    response = client.get('/metadata/v0/udi/datapackage.json')
    assert response.status == '200 OK'
    data = response.get_json()

    assert data['name'] == 'hubmap_metadata'
    assert data['udi:name'] == 'hubmap_api'
    assert len(data['resources']) == 3
    assert [r['name'] for r in data['resources']] == ['donors', 'samples', 'datasets']

    # Check donors resource structure
    donors = data['resources'][0]
    assert donors['udi:row_count'] == 1
    assert donors['type'] == 'table'
    assert donors['format'] == 'tsv'
    assert donors['schema']['primaryKey'] == ['hubmap_id']
    assert donors['schema']['foreignKeys'] == []

    # Check field details
    field_names = [f['name'] for f in donors['schema']['fields']]
    assert field_names[0] == 'uuid'
    assert field_names[1] == 'hubmap_id'
    assert 'age_unit' in field_names
    assert 'age_value' in field_names

    # Check UBKG type resolution
    age_value_field = next(f for f in donors['schema']['fields'] if f['name'] == 'age_value')
    assert age_value_field['type'] == 'number'
    assert age_value_field['description'] == 'The time elapsed since birth.'
    assert age_value_field['udi:data_type'] == 'quantitative'
    assert age_value_field['udi:cardinality'] == 1
    assert age_value_field['udi:unique'] is not False

    age_unit_field = next(f for f in donors['schema']['fields'] if f['name'] == 'age_unit')
    assert age_unit_field['type'] == 'string'
    assert age_unit_field['udi:data_type'] == 'nominal'

    # Fields without UBKG info should default to string
    uuid_field = next(f for f in donors['schema']['fields'] if f['name'] == 'uuid')
    assert uuid_field['type'] == 'string'
    assert uuid_field['description'] == ''

    # With only 1 row, all non-empty fields overlap with all
    assert age_value_field['udi:overlapping_fields'] == 'all'

    # Samples should have foreign keys
    samples = data['resources'][1]
    assert len(samples['schema']['foreignKeys']) == 1
    assert samples['schema']['foreignKeys'][0]['reference']['resource'] == 'donors'

    # Datasets should have 2 foreign keys
    datasets = data['resources'][2]
    assert len(datasets['schema']['foreignKeys']) == 2


def test_datapackage_cors(client, mocker):
    mocker.patch('requests.post', side_effect=mock_es_post)
    mocker.patch('requests.get', side_effect=mock_es_get)
    response = client.get(
        '/metadata/v0/udi/datapackage.json',
        headers={'Origin': 'https://hms-dbmi.github.io'},
    )
    assert response.headers.get('Access-Control-Allow-Origin') == 'https://hms-dbmi.github.io'


def test_datapackage_no_cors_for_unknown_origin(client, mocker):
    mocker.patch('requests.post', side_effect=mock_es_post)
    mocker.patch('requests.get', side_effect=mock_es_get)
    response = client.get(
        '/metadata/v0/udi/datapackage.json',
        headers={'Origin': 'https://evil.com'},
    )
    assert 'Access-Control-Allow-Origin' not in response.headers


def test_yac_examples(client):
    response = client.get('/v1/yac/examples')
    assert response.status == '200 OK'
    data = response.get_json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert all(isinstance(p, str) for p in data)


def test_yac_examples_cors(client):
    response = client.get(
        '/v1/yac/examples',
        headers={'Origin': 'https://hms-dbmi.github.io'},
    )
    assert response.headers.get('Access-Control-Allow-Origin') == 'https://hms-dbmi.github.io'


def test_yac_completions_preflight_from_localhost(client):
    response = client.options(
        '/v1/yac/completions',
        headers={
            'Origin': 'http://localhost:5173',
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'authorization,content-type,x-openai-key',
        },
    )
    assert response.status_code in (200, 204)
    assert response.headers.get('Access-Control-Allow-Origin') == 'http://localhost:5173'
    allowed_headers = response.headers.get('Access-Control-Allow-Headers', '').lower()
    assert 'authorization' in allowed_headers
    assert 'x-openai-key' in allowed_headers
    assert 'content-type' in allowed_headers
    assert 'POST' in response.headers.get('Access-Control-Allow-Methods', '')


_sample_completion_body = {
    'messages': [{'role': 'user', 'content': 'show a bar chart of donors by sex'}],
    'dataSchema': '{"resources": []}',
    'dataDomains': '[]',
}


def _mock_orchestrator_run(**_kwargs):
    class _Result:
        tool_calls = [{'name': 'CreateVisualization', 'arguments': {'title': 'test'}}]
        orchestrator_choice = 'render-visualization'

    return _Result()


def test_yac_completions_missing_body(client):
    response = client.post('/v1/yac/completions', json={'messages': []})
    assert response.status_code == 400
    assert 'dataSchema' in response.get_json()['message']


def test_yac_completions_requires_key_for_anon(client):
    response = client.post('/v1/yac/completions', json=_sample_completion_body)
    assert response.status_code == 401


def _capture_run(mocker):
    """Patch Orchestrator.run and return a dict that captures its kwargs and
    the orchestrator instance it was called on."""
    captured = {}

    def _capture(self, **kwargs):
        captured['self'] = self
        captured.update(kwargs)
        return _mock_orchestrator_run()

    mocker.patch('app.routes_udi.Orchestrator.run', _capture)
    return captured


def test_yac_completions_anon_with_header(client, mocker):
    captured = _capture_run(mocker)
    response = client.post(
        '/v1/yac/completions',
        json=_sample_completion_body,
        headers={'X-OpenAI-Key': 'sk-anon'},
    )
    assert response.status == '200 OK'
    assert response.get_json() == [{'name': 'CreateVisualization', 'arguments': {'title': 'test'}}]
    assert captured['self'] is routes_udi._get_byok_orchestrator()
    assert captured['openai_api_key'] == 'sk-anon'


def test_yac_completions_hubmap_user_uses_config_key(client, mocker):
    client.application.config['OPENAI_API_KEY'] = 'sk-server'
    captured = _capture_run(mocker)
    with client.session_transaction() as sess:
        sess['groups_token'] = 'token'
        sess['user_groups'] = ['HuBMAP']
    response = client.post('/v1/yac/completions', json=_sample_completion_body)
    assert response.status == '200 OK'
    # HuBMAP users hit the pre-configured orchestrator; no per-request override.
    assert captured['self'] is routes_udi._get_hubmap_orchestrator()
    assert captured['openai_api_key'] is None
    # The pre-configured agent actually has a live OpenAI client (key baked in).
    assert captured['self'].agent.gpt_model is not None


def test_yac_completions_hubmap_user_without_config_key_falls_back_to_header(client, mocker):
    client.application.config['OPENAI_API_KEY'] = None
    captured = _capture_run(mocker)
    with client.session_transaction() as sess:
        sess['groups_token'] = 'token'
        sess['user_groups'] = ['HuBMAP']
    response = client.post(
        '/v1/yac/completions',
        json=_sample_completion_body,
        headers={'X-OpenAI-Key': 'sk-header'},
    )
    assert response.status == '200 OK'
    assert captured['self'] is routes_udi._get_byok_orchestrator()
    assert captured['openai_api_key'] == 'sk-header'


def test_yac_completions_non_hubmap_authed_user_needs_header(client):
    client.application.config['OPENAI_API_KEY'] = 'sk-server'
    with client.session_transaction() as sess:
        sess['groups_token'] = 'token'
        sess['user_groups'] = ['Workspaces']
    response = client.post('/v1/yac/completions', json=_sample_completion_body)
    assert response.status_code == 401
