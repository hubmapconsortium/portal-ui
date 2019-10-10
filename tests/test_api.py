import requests

from portal.api import ApiClient


def test_api_get_entity_types(mocker):
    mocker.patch('requests.get')
    api = ApiClient('http://FAKE')
    api.get_entity_types()
    requests.get.assert_called_once_with('http://FAKE/entities')
