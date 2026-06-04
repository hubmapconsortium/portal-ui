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


@pytest.fixture(autouse=True)
def _reset_udi_data_cache():
    # The datapackage/TSV cache is module-level; tests need a cold cache
    # to deterministically observe miss-vs-hit behavior.
    routes_udi._udi_cache.clear()
    yield
    routes_udi._udi_cache.clear()


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


def test_localhost_origin_rejected_in_production(client):
    # Disable both debug and testing flags to simulate production config.
    client.application.debug = False
    client.application.config['TESTING'] = False
    response = client.get(
        '/v1/yac/examples',
        headers={'Origin': 'http://localhost:5173'},
    )
    assert 'Access-Control-Allow-Origin' not in response.headers


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


def test_build_orchestrator_forwards_langfuse_config(client, mocker):
    client.application.config['LANGFUSE_PUBLIC_KEY'] = 'pk-lf-test'
    client.application.config['LANGFUSE_SECRET_KEY'] = 'sk-lf-test'
    client.application.config['LANGFUSE_BASE_URL'] = 'https://langfuse.example.com'
    client.application.config['OPENAI_API_KEY'] = 'sk-server'

    captured = {}

    def _fake_agent(**kwargs):
        captured.update(kwargs)
        return mocker.MagicMock()

    mocker.patch('app.routes_udi.UDIAgent', side_effect=_fake_agent)
    mocker.patch('app.routes_udi.Orchestrator', side_effect=lambda **_: mocker.MagicMock())

    with client.application.test_request_context():
        routes_udi._get_hubmap_orchestrator()

    assert captured['langfuse_public_key'] == 'pk-lf-test'
    assert captured['langfuse_secret_key'] == 'sk-lf-test'
    assert captured['langfuse_host'] == 'https://langfuse.example.com'
    assert captured['openai_api_key'] == 'sk-server'


def test_yac_completions_non_hubmap_authed_user_needs_header(client):
    client.application.config['OPENAI_API_KEY'] = 'sk-server'
    with client.session_transaction() as sess:
        sess['groups_token'] = 'token'
        sess['user_groups'] = ['Workspaces']
    response = client.post('/v1/yac/completions', json=_sample_completion_body)
    assert response.status_code == 401


def _patch_es(mocker):
    return (
        mocker.patch('requests.post', side_effect=mock_es_post),
        mocker.patch('requests.get', side_effect=mock_es_get),
    )


def test_datapackage_public_emits_public_cache_headers(client, mocker):
    _patch_es(mocker)
    response = client.get('/metadata/v0/udi/datapackage.json')
    assert response.status_code == 200
    assert response.headers.get('Cache-Control') == 'public, max-age=43200'
    assert response.headers.get('ETag')


def test_datapackage_consortium_emits_private_cache_headers(client, mocker):
    _patch_es(mocker)
    with client.session_transaction() as sess:
        sess['groups_token'] = 'token'
        sess['user_groups'] = ['HuBMAP']
    response = client.get('/metadata/v0/udi/consortium/datapackage.json')
    assert response.status_code == 200
    assert response.headers.get('Cache-Control') == 'private, no-store'
    assert response.headers.get('ETag') is None


def test_datapackage_public_route_serves_authed_users_from_shared_cache(client, mocker):
    post_mock, _ = _patch_es(mocker)
    # First request: anonymous, populates the shared cache.
    anon_response = client.get('/metadata/v0/udi/datapackage.json')
    assert anon_response.status_code == 200
    initial_post_calls = post_mock.call_count
    assert initial_post_calls > 0

    # Second request: authed user hitting the same public path must reuse the
    # shared cache entry byte-for-byte and skip the ES fan-out.
    with client.session_transaction() as sess:
        sess['groups_token'] = 'token'
        sess['user_groups'] = ['HuBMAP']
    authed_response = client.get('/metadata/v0/udi/datapackage.json')
    assert authed_response.status_code == 200
    assert authed_response.headers.get('Cache-Control') == 'public, max-age=43200'
    assert authed_response.headers.get('ETag') == anon_response.headers.get('ETag')
    assert authed_response.get_data() == anon_response.get_data()
    assert post_mock.call_count == initial_post_calls


def test_datapackage_public_route_does_not_pass_groups_token(client, mocker):
    _patch_es(mocker)
    api_client_mock = mocker.patch('app.utils.ApiClient')
    with client.session_transaction() as sess:
        sess['groups_token'] = 'real-token'
        sess['user_groups'] = ['HuBMAP']
    response = client.get('/metadata/v0/udi/datapackage.json')
    assert response.status_code == 200
    assert api_client_mock.called
    for call in api_client_mock.call_args_list:
        assert call.kwargs.get('groups_token') is None


def test_datapackage_consortium_route_passes_groups_token(client, mocker):
    _patch_es(mocker)
    api_client_mock = mocker.patch('app.utils.ApiClient')
    with client.session_transaction() as sess:
        sess['groups_token'] = 'real-token'
        sess['user_groups'] = ['HuBMAP']
    response = client.get('/metadata/v0/udi/consortium/datapackage.json')
    assert response.status_code == 200
    assert api_client_mock.called
    for call in api_client_mock.call_args_list:
        assert call.kwargs.get('groups_token') == 'real-token'


def test_datapackage_udi_path_reflects_request_route(client, mocker):
    _patch_es(mocker)
    public_response = client.get('/metadata/v0/udi/datapackage.json')
    assert public_response.get_json()['udi:path'].endswith('/metadata/v0/udi/')

    with client.session_transaction() as sess:
        sess['groups_token'] = 'token'
        sess['user_groups'] = ['HuBMAP']
    consortium_response = client.get('/metadata/v0/udi/consortium/datapackage.json')
    assert consortium_response.get_json()['udi:path'].endswith('/metadata/v0/udi/consortium/')


def test_tsv_public_emits_public_cache_headers(client, mocker):
    _patch_es(mocker)
    response = client.get('/metadata/v0/udi/datasets.tsv')
    assert response.status_code == 200
    assert response.headers.get('Cache-Control') == 'public, max-age=43200'
    assert response.headers.get('ETag')


def test_tsv_consortium_emits_private_cache_headers(client, mocker):
    _patch_es(mocker)
    with client.session_transaction() as sess:
        sess['groups_token'] = 'token'
        sess['user_groups'] = ['HuBMAP']
    response = client.get('/metadata/v0/udi/consortium/datasets.tsv')
    assert response.status_code == 200
    assert response.headers.get('Cache-Control') == 'private, no-store'
    assert response.headers.get('ETag') is None


def test_tsv_public_route_serves_authed_users_from_shared_cache(client, mocker):
    post_mock, _ = _patch_es(mocker)
    anon_response = client.get('/metadata/v0/udi/datasets.tsv')
    assert anon_response.status_code == 200
    initial_post_calls = post_mock.call_count
    assert initial_post_calls > 0

    with client.session_transaction() as sess:
        sess['groups_token'] = 'token'
        sess['user_groups'] = ['HuBMAP']
    authed_response = client.get('/metadata/v0/udi/datasets.tsv')
    assert authed_response.status_code == 200
    assert authed_response.headers.get('Cache-Control') == 'public, max-age=43200'
    assert authed_response.headers.get('ETag') == anon_response.headers.get('ETag')
    assert authed_response.get_data() == anon_response.get_data()
    assert post_mock.call_count == initial_post_calls


def test_tsv_consortium_route_does_not_share_cache_with_public(client, mocker):
    post_mock, _ = _patch_es(mocker)
    public_response = client.get('/metadata/v0/udi/datasets.tsv')
    assert public_response.status_code == 200
    after_public_calls = post_mock.call_count

    with client.session_transaction() as sess:
        sess['groups_token'] = 'token'
        sess['user_groups'] = ['HuBMAP']
    consortium_response = client.get('/metadata/v0/udi/consortium/datasets.tsv')
    assert consortium_response.status_code == 200
    # Consortium fetches always re-issue the ES query, since the response is
    # per-user-scoped and cannot share the shared public cache.
    assert post_mock.call_count > after_public_calls


# ---- Field stripping (assaytype) and revision filtering ----

mock_es_with_assaytype = {
    'hits': {
        'total': {'value': 1},
        'hits': [
            {
                '_source': {
                    'uuid': 'ABC123',
                    'hubmap_id': 'HMB123.XYZ',
                    'mapped_metadata': {
                        'age_unit': ['eons'],
                        'age_value': [42],
                        'assaytype': ['10x Multiome'],
                    },
                }
            }
        ],
    }
}


def _patch_es_with_assaytype(mocker):
    def _post(_path, **_kwargs):
        class MockResponse:
            status_code = 0
            text = 'Logger call requires this'

            def json(self):
                return mock_es_with_assaytype

            def raise_for_status(self):
                pass

        return MockResponse()

    return (
        mocker.patch('requests.post', side_effect=_post),
        mocker.patch('requests.get', side_effect=mock_es_get),
    )


def test_datapackage_strips_assaytype_field(client, mocker):
    _patch_es_with_assaytype(mocker)
    response = client.get('/metadata/v0/udi/datapackage.json')
    assert response.status_code == 200
    data = response.get_json()
    for resource in data['resources']:
        field_names = [f['name'] for f in resource['schema']['fields']]
        assert 'assaytype' not in field_names, (
            f'assaytype should not appear in {resource["name"]} schema, got {field_names}'
        )


def test_tsv_strips_assaytype_field(client, mocker):
    _patch_es_with_assaytype(mocker)
    response = client.get('/metadata/v0/udi/datasets.tsv')
    assert response.status_code == 200
    body = response.get_data(as_text=True)
    header_line = body.splitlines()[0]
    assert 'assaytype' not in header_line.split('\t')


def _capture_es_post_bodies(mocker):
    bodies = []

    def _post(_path, **kwargs):
        bodies.append(kwargs.get('json'))

        class MockResponse:
            status_code = 0
            text = 'Logger call requires this'

            def json(self):
                return mock_es

            def raise_for_status(self):
                pass

        return MockResponse()

    mocker.patch('requests.post', side_effect=_post)
    mocker.patch('requests.get', side_effect=mock_es_get)
    return bodies


def _query_excludes_revisions(query):
    """Walk the ES query tree and return True if a must_not clause excludes
    both next_revision_uuid and sub_status via `exists`."""
    if not isinstance(query, dict):
        return False
    bool_clause = query.get('bool', {})
    must_not = bool_clause.get('must_not', [])
    excluded = {
        clause.get('exists', {}).get('field') for clause in must_not if isinstance(clause, dict)
    }
    return {'next_revision_uuid', 'sub_status'}.issubset(excluded)


def test_datapackage_query_excludes_superseded_and_sub_status(client, mocker):
    bodies = _capture_es_post_bodies(mocker)
    response = client.get('/metadata/v0/udi/datapackage.json')
    assert response.status_code == 200
    # Each entity-type fetch (donors/samples/datasets) hits ES; assert at least
    # one query for each carries the revision-exclusion clause.
    assert bodies, 'expected at least one ES query'
    queries_with_filter = [b for b in bodies if _query_excludes_revisions(b.get('query', {}))]
    assert len(queries_with_filter) >= 3, (
        f'expected revisions filter on each of donors/samples/datasets, got '
        f'{len(queries_with_filter)} of {len(bodies)} queries with the filter'
    )


def test_tsv_query_excludes_superseded_and_sub_status(client, mocker):
    bodies = _capture_es_post_bodies(mocker)
    response = client.get('/metadata/v0/udi/datasets.tsv')
    assert response.status_code == 200
    assert any(_query_excludes_revisions(b.get('query', {})) for b in bodies)


def test_regular_metadata_tsv_does_not_apply_udi_filters(client, mocker):
    """The non-UDI /metadata/v0/<entity>.tsv route should keep the existing
    behavior: no revisions filter, no assaytype stripping."""
    bodies = _capture_es_post_bodies(mocker)
    response = client.get('/metadata/v0/datasets.tsv')
    assert response.status_code == 200
    assert all(not _query_excludes_revisions(b.get('query', {})) for b in bodies)
