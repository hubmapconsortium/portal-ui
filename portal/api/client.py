from collections import namedtuple
import json

import requests

# Hopefully soon, generate API client code from OpenAPI:
# https://github.com/hubmapconsortium/hubmap-data-portal/issues/179


Entity = namedtuple('Entity', ['uuid', 'type', 'name'], defaults=['TODO: name'])


class ApiClient():
    def __init__(self, url_base, nexus_token):
        self.url_base = url_base
        self.nexus_token = nexus_token

    def _request(self, path):
        headers = {'Authorization': 'Bearer ' + self.nexus_token}
        response = requests.get(
            f'{self.url_base}{path}',
            headers=headers
        )
        return response.json()

    def get_entity_types(self):
        # NOTE: Not called right now, but tested by test_api.py.
        response = requests.get(f'{self.url_base}/entities')
        return response.json()['entity_types']

    def get_entities(self, type):
        response = self._request(f'/entities/types/{type}')
        return [Entity(uuid, type) for uuid in response['uuids']]

    def get_entity(self, uuid):
        response = self._request(f'/entities/{uuid}')
        return response['entity_node']

    def get_contributor(self, id):
        return {
            'name': 'Santa Claus',
            'affiliation': 'North Pole'
        }

    def get_donor_uuids(self, user=None):
        pass
        # TODO?:
        # if user:
        #     response = requests.get(
        #         f'{self.url_base}/entities/donors/created-by/{quote_plus(user)}'
        #     )
        # else:
        #     response = requests.get(f'{self.url_base}/entities/donors')
        # return response.json()['uuids']

    def get_provenance(self, uuid):
        response = self._request(f'/entities/{uuid}/provenance')
        provenance = json.loads(response['provenance_data'])

        # TODO: These should not be needed with next update to NPM.
        del provenance['agent']
        provenance['prefix']['hubmap'] = 'https://hubmapconsortium.org'
        
        return provenance


# TODO: More functions
