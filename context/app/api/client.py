from collections import namedtuple
import json
from datetime import datetime
import urllib
from pathlib import Path
import itertools

from flask import abort, current_app

from datauri import DataURI
import requests

Entity = namedtuple('Entity', ['uuid', 'type', 'name'], defaults=['TODO: name'])

# Hardcoded CODEX offsets and tile path.
CODEX_OFFSETS_PATH = 'ppneorh7'
CODEX_TILE_PATH = 'output/extract/expressions/ome-tiff'
# Hardocde just looking at a few tiles.
X_VALS = list(range(3))
X_VALS.remove(0)
Y_VALS = list(range(3))
Y_VALS.remove(0)
R_VALS = list(range(3))
R_VALS.remove(0)

SCATTERPLOT = {
    'layers': [],
    'name': 'NAME',
    'staticLayout': [
        {
            'component': 'scatterplot',
            'props': {
                # Need to get a better name/way to handle this but for now, this is fine.
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

IMAGING = {
    'name': 'NAME',
    'layers': [],
    'staticLayout': [
        {'component': 'layerController', 'x': 0, 'y': 0, 'w': 4, 'h': 6},
        {
            'component': 'spatial',
            'props': {
                'view': {
                    'zoom': -1,
                    'target': [512, 512, 0],
                },
            },
            'x': 4,
            'y': 0,
            'w': 8,
            'h': 6,
        },
    ],
}


ASSAY_CONF_LOOKUP = {
    'salmon_rnaseq_10x': {
        'base_conf': SCATTERPLOT,
        'files_conf': [
            {'rel_path': 'dim_reduced_clustered/dim_reduced_clustered.json', 'type': 'CELLS'},
            # { 'rel_path': 'cluster-marker-genes/cluster_marker_genes.json', 'type': 'FACTORS' }
        ]
    },
    'codex_cytokit': {
        'base_conf': IMAGING,
        'files_conf': [
            # Hardcoded for now only one tile.
            {'rel_path': Path(CODEX_TILE_PATH) / Path(f'#CODEX_TILE#.ome.tiff'), 'type': 'RASTER'}
        ]
    }
}

IMAGE_ASSAYS = ['codex_cytokit']


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

        # TODO: Reenable with new document structure.
        # entity['created'] = _format_timestamp(entity['provenance_create_timestamp'])
        # entity['modified'] = _format_timestamp(entity['provenance_modified_timestamp'])
        return entity

    def get_provenance(self, uuid):
        # TODO: When the API is fixed, only use this when is_mock.

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

        provenance = self._request(f'/entities/{uuid}/provenance')

        # TODO: These should not be needed with next update to NPM.
        del provenance['agent']
        provenance['prefix']['hubmap'] = 'https://hubmapconsortium.org'

        return provenance

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
            return self._build_vitessce_conf(entity)

    def _build_assets_url(self, rel_path, uuid):
        base_url = urllib.parse.urljoin(
            current_app.config['ASSETS_ENDPOINT'],
            str(Path(uuid) / Path(rel_path))
        )
        token_param = urllib.parse.urlencode({'token': self.nexus_token})
        return base_url + '?' + token_param

    def _build_image_schema(self, rel_path, uuid):
        schema = {}
        schema['name'] = Path(rel_path).name
        schema['type'] = 'ome-tiff'
        schema['url'] = self._build_assets_url(rel_path, uuid)
        schema['metadata'] = {}
        offsets_path = Path(CODEX_OFFSETS_PATH) / \
            Path(Path(rel_path).name.replace('ome.tiff', 'offsets.json'))
        schema['metadata']['omeTiffOffsetsUrl'] = self._build_assets_url(str(offsets_path), uuid)
        return schema

    def _build_image_layer_datauri(self, rel_path, uuid):
        image_layer = {}
        image_paths = [
            str(rel_path).replace(
                '#CODEX_TILE#', f'R{str(r).zfill(3)}_X{str(x).zfill(3)}_Y{str(y).zfill(3)}'
            ) for (r, x, y) in itertools.product(*[R_VALS, X_VALS, Y_VALS])
        ]
        image_layer['images'] = [
            self._build_image_schema(image_path, uuid) for image_path in image_paths
        ]
        image_layer['schema_version'] = '0.0.1'
        return DataURI.make(
            'text/plain', charset='us-ascii', base64=True, data=json.dumps(image_layer)
        )

    def _build_layer_conf(self, file, uuid, assay_type):
        return {
            'type': file['type'],
            'url': self._build_assets_url(file['rel_path'], uuid)
            if assay_type not in IMAGE_ASSAYS
            else self._build_image_layer_datauri(file['rel_path'], uuid),
            'name': file['type'].lower(),
        }

    def _build_vitessce_conf(self, entity):
        # Can there be more than one of these?  This seems like a fine default for now.
        assay_type = entity['data_types'][0]
        uuid = entity['uuid']
        conf = ASSAY_CONF_LOOKUP[assay_type]['base_conf']
        files = ASSAY_CONF_LOOKUP[assay_type]['files_conf']
        layers = [self._build_layer_conf(file, uuid, assay_type) for file in files]

        conf['layers'] = layers
        conf['name'] = uuid
        return conf
