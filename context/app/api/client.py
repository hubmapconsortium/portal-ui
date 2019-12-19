from collections import namedtuple
import json
from datetime import datetime

import requests

# Hopefully soon, generate API client code from OpenAPI:
# https://github.com/hubmapconsortium/hubmap-data-portal/issues/179


Entity = namedtuple('Entity', ['uuid', 'type', 'name'], defaults=['TODO: name'])


def _format_timestamp(ts):
    return datetime.utcfromtimestamp(int(ts) / 1000).strftime('%Y-%m-%d %H:%M:%S')


class ApiClient():
    def __init__(self, url_base=None, nexus_token=None, is_mock=False):
        self.url_base = url_base
        self.nexus_token = nexus_token
        self.is_mock = is_mock

    def _request(self, path):
        headers = {'Authorization': 'Bearer ' + self.nexus_token}
        response = requests.get(
            f'{self.url_base}{path}',
            headers=headers
        )
        response.raise_for_status()
        return response.json()

    def get_entity_types(self):
        # NOTE: Not called right now, but tested by test_api.py.
        response = requests.get(f'{self.url_base}/entities')
        return response.json()['entity_types']

    def get_entities(self, type):
        if self.is_mock:
            return [Entity(uuid, type) for uuid in range(10)]
        response = self._request(f'/entities/types/{type}')
        return [Entity(uuid, type) for uuid in response['uuids']]

    def get_entity(self, uuid):
        if self.is_mock:
            return {
                'created': '2020-01-01 00:00:00',
                'modified': '2020-01-01 00:00:00',
                'provenance_user_displayname': 'Chuck McCallum',
                'provenance_user_email': 'mccalluc@example.com',
                'provenance_group_name': 'Mock Group',
                'display_doi': 'abcd-1234',
                'description': 'Mock Entity'
            }
        response = self._request(f'/entities/{uuid}')
        entity = response['entity_node']
        # TODO: Move this into object
        entity['created'] = _format_timestamp(entity['provenance_create_timestamp'])
        entity['modified'] = _format_timestamp(entity['provenance_modified_timestamp'])
        return response['entity_node']

    def get_provenance(self, uuid):
        if self.is_mock:
            return {
                'prefix': {
                    'ex': 'http://example.com#',
                    'prov': 'http://www.w3.org/ns/prov#',
                    'hubmap': 'https://hubmapconsortium.org'
                },
                'entity': {
                    'ex:input': {'prov:label': 'Input', 'ex:note': 'Begins here...'},
                    'ex:output': {'prov:label': 'Output', 'ex:note': '... and ends here.'},
                },
                'activity': {
                    'ex:process': {'prov:label': 'Process'},
                },
                'wasGeneratedBy': {
                    '_:1': {
                        'prov:activity': 'ex:process',
                        'prov:entity': 'ex:output',
                    },
                },
                'used': {
                    '_:2': {
                        'prov:activity': 'ex:process',
                        'prov:entity': 'ex:input',
                    },
                },
            }
        response = self._request(f'/entities/{uuid}/provenance')
        provenance = json.loads(response['provenance_data'])

        # TODO: These should not be needed with next update to NPM.
        del provenance['agent']
        provenance['prefix']['hubmap'] = 'https://hubmapconsortium.org'

        return provenance


# TODO: More functions
