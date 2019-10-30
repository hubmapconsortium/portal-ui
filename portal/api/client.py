import requests

# Hopefully soon, generate API client code from OpenAPI:
# https://github.com/hubmapconsortium/hubmap-data-portal/issues/179


class ApiClient():
    def __init__(self, url_base):
        self.url_base = url_base

    def get_entity_types(self):
        # NOTE: Not called right now, but tested by test_api.py.
        response = requests.get(f'{self.url_base}/entities')
        return response.json()['entity_types']

    def get_entities(self, type):
        return [
            {
                'type': type,
                'uuid': 'abc-123'
            },
            {
                'type': type,
                'uuid': 'ijk-345'
            },
            {
                'type': type,
                'uuid': 'xyz-789'
            }
        ]

    def get_entity(self, uuid):
        return {
            'title': 'Entirely fake entity',
            'date-published': '2020-01-01',
            'authors': ['Austen, Jane', 'Basho', 'Carroll, Lewis'],
            'Planets and Moons': [
                {'planet': 'Earth', 'moons': ['Luna']},
                {'planet': 'Mars', 'moons': ['Phobos', 'Deimos']},
            ],
            'credits': {'Catering': 'Clover', 'Dolly Grip': 'ABC', 'Gaffer': 'XYZ'}
        }
        # TODO?:
        # response = requests.get(f'{self.url_base}/entities/{quote_plus(uuid)}')
        # return response.json()

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
