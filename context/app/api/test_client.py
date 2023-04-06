import pytest

import json

from .client import ApiClient


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

def mock_post_303():
    class MockResponse():
        def __init__(self):
            self.status_code = 303
            self.content = 's3-bucket-url'
            
        def raise_for_status(self):
            pass
    return MockResponse()

def mock_get_s3_json_file():
    class MockResponse():
        def __init__(self):
            self.status_code = 200
            self.content = json.dumps(mock_es)
            
        def raise_for_status(self):
            pass
    return MockResponse()

def test_s3_redirect( mocker):
    mocker.patch('requests.post', side_effect=mock_post_303)
    mocker.patch('requests.get', side_effect=mock_get_s3_json_file)
    api_client = ApiClient()
    response = api_client._request('search-api-url', body_json={'query': {}})
    assert response == mock_es

