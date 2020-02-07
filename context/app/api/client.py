from collections import namedtuple
import json
from datetime import datetime

from flask import abort, current_app

from datauri import DataURI
import requests


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
        try:
            response = requests.get(
                f'{self.url_base}{path}',
                headers=headers,
                timeout=current_app.config['ENTITY_API_TIMEOUT']
            )
        except requests.exceptions.ConnectTimeout as error:
            current_app.logger.info(error)
            abort(504)
        try:
            response.raise_for_status()
        except requests.exceptions.HTTPError as error:
            current_app.logger.info(error.response.text)
            status = error.response.status_code
            if status in [400, 404]:
                # The same 404 page will be returned,
                # whether it's a missing route in portal-ui,
                # or a missing entity in the API.
                abort(status)
            raise
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

    def get_vitessce_conf(self):
        if self.is_mock:
            cellsData = json.dumps({'cell-id-1': {'mappings': {'t-SNE': [1, 1]}}})
            cellsUri = DataURI.make(
                'text/plain', charset='us-ascii', base64=True, data=cellsData
            )
        else:
            # TODO: Hit File API
            cellsUri = 'https://assets.test.hubmapconsortium.org/' \
                '686cd8e0c2a9fa2dc1a321330158dcd7/umap/' \
                'cluster_marker_genes/cluster_marker_genes.json'

        return {
            "description": "DEMO",
            "layers": [
                {
                    "name": "cells",
                    "type": "CELLS",
                    "url": cellsUri,
                    "requestInit": {
                        "headers": {
                            'Authorization': 'Bearer ' + self.nexus_token
                        }
                    }
                },
            ],
            "name": "Linnarsson",
            "staticLayout": [
                {
                    "component": "scatterplot",
                    "props": {
                        "mapping": "UMAP",
                        "view": {
                            "zoom": 4,
                            "target": [0, 0, 0]
                        }
                    },
                    "x": 0, "y": 0, "w": 12, "h": 2
                },
            ]
        }
