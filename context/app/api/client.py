from collections import namedtuple
import json
from datetime import datetime

from datauri import DataURI
from flask import abort, current_app
import requests

from .vitessce import Vitessce

Entity = namedtuple('Entity', ['uuid', 'type', 'name'], defaults=['TODO: name'])


def _format_timestamp(ts):
    return datetime.utcfromtimestamp(int(ts) / 1000).strftime('%Y-%m-%d %H:%M:%S')


class ApiClient():
    def __init__(self, url_base=None, nexus_token=None, is_mock=False):
        self.url_base = url_base
        self.nexus_token = nexus_token
        self.is_mock = is_mock

    def _request(self, path):
        # TODO: If we get everythin via Elasticsearch,
        # this won't be necessary going forward.
        # If we do end up keeping it, we should clean up the copy and paste.
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
            if status in [401]:
                # I believe we have 401 errors when the globus credentials
                # have expired, but are still in the flask session.
                abort(status)
            raise
        return response.json()

    def _post_check_errors(self, url, json):
        try:
            response = requests.post(
                url, json=json,
                headers={'Authorization': 'Bearer ' + self.nexus_token})
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
            if status in [401]:
                # I believe we have 401 errors when the globus credentials
                # have expired, but are still in the flask session.
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

        query = {
            'query': {
                'match': {
                    'uuid': uuid
                }
            }
        }
        response_json = self._post_check_errors(
            current_app.config['ELASTICSEARCH_ENDPOINT'],
            json=query)

        hits = response_json['hits']['hits']

        if len(hits) == 0:
            abort(404)
        if len(hits) > 1:
            # In the search-api, we could avoid this:
            # https://github.com/hubmapconsortium/search-api/issues/23
            raise Exception(f'UUID not unique; got {len(hits)} matches')
        entity = hits[0]['_source']

        if 'metadata' not in entity:
            entity['metadata'] = {}

        # TODO: Reenable with new document structure.
        # entity['created'] = _format_timestamp(entity['provenance_create_timestamp'])
        # entity['modified'] = _format_timestamp(entity['provenance_modified_timestamp'])
        return entity


    def get_vitessce_conf(self, entity):
        if ('files' not in entity or 'data_types' not in entity):
            # Would a default no-viz config be better?
            return {}
        if self.is_mock:
            cellsData = json.dumps({'cell-id-1': {'mappings': {'t-SNE': [1, 1]}}})
            cellsUri = DataURI.make(
                'text/plain', charset='us-ascii', base64=True, data=cellsData
            )
            token = 'fake-token'
            return {
                'description': 'DEMO',
                'layers': [
                    {
                        'name': 'cells',
                        'type': 'CELLS',
                        'url': cellsUri,
                        'requestInit': {
                            'headers': {
                                'Authorization': 'Bearer ' + token
                            }
                        }
                    },
                ],
                'name': 'Linnarsson',
                'staticLayout': [
                    {
                        'component': 'scatterplot',
                        'props': {
                            'mapping': 'UMAP',
                            'view': {
                                'zoom': 4,
                                'target': [0, 0, 0]
                            }
                        },
                        'x': 0, 'y': 0, 'w': 12, 'h': 2
                    },
                ]
            }
        else:
            vitessce = Vitessce(entity=entity, nexus_token=self.nexus_token)
            return vitessce.conf
