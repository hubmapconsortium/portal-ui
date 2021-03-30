from collections import namedtuple
import json
import traceback

from datauri import DataURI
from flask import abort, current_app
import requests

from .vitessce_confs import get_view_config_class_for_data_types

Entity = namedtuple('Entity', ['uuid', 'type', 'name'], defaults=['TODO: name'])


class ApiClient():
    def __init__(self, url_base=None, nexus_token=None, is_mock=False):
        self.url_base = url_base
        self.nexus_token = nexus_token
        self.is_mock = is_mock

    def _request(self, url, body_json=None):
        headers = {'Authorization': 'Bearer ' + self.nexus_token} if self.nexus_token else {}
        try:
            response = (
                requests.post(url, headers=headers, json=body_json)
                if body_json
                else requests.get(url, headers=headers)
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

    def get_all_dataset_uuids(self):
        size = 10000  # Default ES limit
        query = {
            "size": size,
            "post_filter": {
                "term": {"entity_type.keyword": "Dataset"}
            },
            "_source": ["empty-returns-everything"]
        }
        response_json = self._request(
            current_app.config['ELASTICSEARCH_ENDPOINT']
            + current_app.config['PORTAL_INDEX_PATH'],
            body_json=query)
        uuids = [hit['_id'] for hit in response_json['hits']['hits']]
        if len(uuids) == size:
            raise Exception(f'At least 10k datasets: need to make multiple requests')
        return uuids

    def get_entity(self, uuid=None, hbm_id=None):
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

        if uuid is not None and hbm_id is not None:
            raise Exception('Only UUID or HBM ID should be provided, not both')
        query = {'query':
                 # ES guarantees that _id is unique, so this is best:
                 {'ids': {'values': [uuid]}}
                 if uuid else
                 {'match': {'display_doi.keyword': hbm_id}}
                 # With default mapping, without ".keyword", it splits into tokens,
                 # and we get multiple substring matches, instead of unique match.
                 }

        response_json = self._request(
            current_app.config['ELASTICSEARCH_ENDPOINT']
            + current_app.config['PORTAL_INDEX_PATH'],
            body_json=query)

        hits = response_json['hits']['hits']

        if len(hits) == 0:
            abort(404)
        if len(hits) > 1:
            raise Exception(f'ID not unique; got {len(hits)} matches for {query}')
        entity = hits[0]['_source']
        return entity

    def get_vitessce_conf(self, entity):
        if ('files' not in entity or 'data_types' not in entity):
            # Would a default no-viz config be better?
            return {}
        if self.is_mock:
            return self._get_mock_vitessce_conf()
        try:
            vc = get_view_config_class_for_data_types(
                entity=entity, nexus_token=self.nexus_token
            )
            conf = vc.build_vitessce_conf()
            return conf
        except Exception:
            current_app.logger.warn(
                f'Building vitessce conf threw error: {traceback.format_exc()}'
            )
            return {}

    def _get_mock_vitessce_conf(self):
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
