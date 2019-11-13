import requests

from portal.api.client import ApiClient


def test_api_get_entity_types(mocker):
    mocker.patch('requests.get')
    client = ApiClient('http://FAKE', 'FAKE-TOKEN')
    client.get_entity_types()
    requests.get.assert_called_once_with('http://FAKE/entities')
