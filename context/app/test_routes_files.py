import json

import pytest
import requests

from .main import create_app
from . import cache_utils
from . import routes_files


VALID_BODY = {
    'size': 0,
    'aggs': {
        'file_extension': {
            'filter': {'bool': {'must': []}},
            'aggs': {'file_extension': {'terms': {'field': 'file_extension.keyword'}}},
        },
    },
}

MOCK_ES_RESPONSE = {
    'hits': {'total': {'value': 9930733}},
    'aggregations': {
        'file_extension': {'file_extension': {'buckets': [{'key': '.tif', 'doc_count': 9733005}]}}
    },
}


class FakeResponse:
    def __init__(self, payload, status_code=200):
        self._payload = payload
        self.status_code = status_code
        self.text = json.dumps(payload) if not isinstance(payload, str) else payload

    def json(self):
        return self._payload

    def raise_for_status(self):
        if self.status_code >= 400:
            raise requests.exceptions.HTTPError(f'status {self.status_code}')


@pytest.fixture
def app(tmp_path):
    app = create_app(testing=True)
    app.config['ELASTICSEARCH_ENDPOINT'] = 'https://mock.search.api'
    app.config['FILES_FACET_CACHE_DIR'] = str(tmp_path)
    cache_utils.clear_memory_cache()
    return app


@pytest.fixture
def client(app):
    with app.test_client() as client:
        yield client


def _capture_post(mocker, payload=MOCK_ES_RESPONSE):
    """Patch requests.post and return the mock so calls can be inspected."""
    return mocker.patch('requests.post', return_value=FakeResponse(payload))


class TestValidation:
    @pytest.mark.parametrize(
        'body,expected_fragment',
        [
            ({'aggs': {'a': {}}}, "must set 'size' to 0"),
            ({'size': 5, 'aggs': {'a': {}}}, "must set 'size' to 0"),
            ({'size': 0}, "non-empty 'aggs'"),
            ({'size': 0, 'aggs': {}}, "non-empty 'aggs'"),
            (
                {'size': 0, 'aggs': {'a': {}}, 'collapse': {'field': 'dataset_uuid.keyword'}},
                "may not include 'collapse'",
            ),
            ({'size': 0, 'aggs': {'a': {}}, 'sort': [{'a': 'asc'}]}, "may not include 'sort'"),
        ],
    )
    def test_rejects_non_aggregation_queries(self, client, mocker, body, expected_fragment):
        post = _capture_post(mocker)
        response = client.post('/api/files/facets', json=body)
        assert response.status_code == 400
        assert expected_fragment in response.get_json()['error']
        # Never reached upstream.
        post.assert_not_called()

    def test_rejects_oversized_body(self, client, mocker):
        post = _capture_post(mocker)
        body = {'size': 0, 'aggs': {'a': {'terms': {'field': 'x' * routes_files.MAX_QUERY_BYTES}}}}
        response = client.post('/api/files/facets', json=body)
        assert response.status_code == 413
        post.assert_not_called()


class TestScopeAndCacheSafety:
    def test_anonymous_request_sends_no_authorization_header(self, client, mocker):
        """The guarantee that makes the shared public cache entry safe."""
        post = _capture_post(mocker)

        response = client.post('/api/files/facets', json=VALID_BODY)
        assert response.status_code == 200

        headers = post.call_args.kwargs['headers']
        assert 'Authorization' not in headers

    def test_anonymous_and_authenticated_use_separate_cache_entries(self, app, mocker):
        """A private response must never be served to an anonymous caller from cache."""
        public_payload = {'hits': {'total': {'value': 1}}, 'aggregations': {'a': 'public'}}
        private_payload = {'hits': {'total': {'value': 2}}, 'aggregations': {'a': 'private'}}

        def fake_post(url, json=None, headers=None, timeout=None):
            is_authed = 'Authorization' in (headers or {})
            return FakeResponse(private_payload if is_authed else public_payload)

        mocker.patch('requests.post', side_effect=fake_post)

        with app.test_client() as authed:
            with authed.session_transaction() as sess:
                sess['groups_token'] = 'a-real-token'
            authed_body = authed.post('/api/files/facets', json=VALID_BODY).get_json()
        assert authed_body['aggregations'] == {'a': 'private'}

        # A fresh anonymous client, same query body, must not get the private entry.
        with app.test_client() as anon:
            anon_body = anon.post('/api/files/facets', json=VALID_BODY).get_json()
        assert anon_body['aggregations'] == {'a': 'public'}

    def test_cache_name_differs_by_scope(self, app):
        with app.app_context():
            public = routes_files._cache_name('public', VALID_BODY)
            private = routes_files._cache_name('private', VALID_BODY)
        assert public != private
        assert public.startswith('public.')
        assert private.startswith('private.')

    def test_cache_name_is_key_order_independent(self, app):
        """Semantically identical bodies must share one entry."""
        with app.app_context():
            a = routes_files._cache_name('public', {'size': 0, 'aggs': {'x': 1}})
            b = routes_files._cache_name('public', {'aggs': {'x': 1}, 'size': 0})
        assert a == b


class TestCaching:
    def test_second_identical_request_is_served_from_cache(self, client, mocker):
        post = _capture_post(mocker)

        first = client.post('/api/files/facets', json=VALID_BODY)
        second = client.post('/api/files/facets', json=VALID_BODY)

        assert first.get_json() == second.get_json()
        assert post.call_count == 1

    def test_different_filters_are_cached_separately(self, client, mocker):
        post = _capture_post(mocker)
        other = {
            'size': 0,
            'aggs': {
                'file_extension': {
                    'filter': {'bool': {'must': [{'terms': {'data_class.keyword': ['Primary']}}]}},
                    'aggs': {'file_extension': {'terms': {'field': 'file_extension.keyword'}}},
                },
            },
        }

        client.post('/api/files/facets', json=VALID_BODY)
        client.post('/api/files/facets', json=other)

        assert post.call_count == 2

    def test_returns_aggregations_only(self, client, mocker):
        _capture_post(mocker)
        body = client.post('/api/files/facets', json=VALID_BODY).get_json()
        assert body['aggregations'] == MOCK_ES_RESPONSE['aggregations']
        # `hits.total` is deliberately not forwarded: Elasticsearch caps it at 10,000 without
        # `track_total_hits`, so it would understate large result sets.
        assert 'fileCount' not in body

    def test_prunes_beyond_max_entries(self, app, mocker):
        _capture_post(mocker)
        app.config['FILES_FACET_CACHE_MAX_ENTRIES'] = 3
        with app.test_client() as client:
            for i in range(6):
                cache_utils.clear_memory_cache()
                client.post(
                    '/api/files/facets',
                    json={'size': 0, 'aggs': {f'agg{i}': {'terms': {'field': 'f.keyword'}}}},
                )
        with app.app_context():
            directory = cache_utils.cache_dir(routes_files.FILES_FACET_CACHE)
        import os

        assert len([n for n in os.listdir(directory) if n.endswith('.json')]) <= 3


class TestUpstreamFailures:
    def test_timeout_returns_504(self, client, mocker):
        mocker.patch('requests.post', side_effect=requests.exceptions.Timeout())
        response = client.post('/api/files/facets', json=VALID_BODY)
        assert response.status_code == 504
        assert 'too long' in response.get_json()['error']

    def test_elasticsearch_error_returns_502(self, client, mocker):
        _capture_post(mocker, {'error': {'type': 'index_not_found_exception'}, 'status': 404})
        response = client.post('/api/files/facets', json=VALID_BODY)
        assert response.status_code == 502
        assert 'error' in response.get_json()

    def test_failures_are_not_cached(self, client, mocker):
        post = mocker.patch('requests.post', side_effect=requests.exceptions.Timeout())
        client.post('/api/files/facets', json=VALID_BODY)
        client.post('/api/files/facets', json=VALID_BODY)
        assert post.call_count == 2
