from collections import namedtuple

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
        return response

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
        return {
            'prefix': {'hubmap': 'https://hubmapconsortium.org'},
            'entity': {
                'ex:input': {'prov:label': 'bedfile'},
                'ex:output': {'prov:label': 'beddbfile'},
            },
            'activity': {
                'ex:run': {'prov:label': 'bedtobeddb'},
            },
            'wasGeneratedBy': {
                '_:1': {
                    'prov:activity': 'ex:run',
                    'prov:entity': 'ex:output',
                },
            },
            'used': {
                '_:2': {
                    'prov:activity': 'ex:run',
                    'prov:entity': 'ex:input',
                },
            },
        }


# TODO: More functions
