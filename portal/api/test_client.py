import requests

from portal.api.client import ApiClient, _format_timestamp


def test_api_get_entity_types(mocker):
    mocker.patch('requests.get')
    client = ApiClient('http://FAKE', 'FAKE-TOKEN')
    client.get_entity_types()
    requests.get.assert_called_once_with('http://FAKE/entities')

def test_format_timestamp():
    assert(_format_timestamp(1000) == '1970-01-01 00:00:01')
    assert(_format_timestamp(1000000000000) == '2001-09-09 01:46:40')
