from collections import namedtuple
import json
import traceback
from copy import deepcopy

from datauri import DataURI
from flask import abort, current_app
import requests

from .vitessce_confs import get_view_config_class_for_data_types
from .vitessce_confs.base_confs import ConfCells

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
            current_app.logger.error(error)
            abort(504)
        try:
            response.raise_for_status()
        except requests.exceptions.HTTPError as error:
            current_app.logger.error(error.response.text)
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
            raise Exception('At least 10k datasets: need to make multiple requests')
        return uuids

    def get_all_donors(self, non_metadata_fields):
        return self._get_all_entities_of_type(non_metadata_fields, 'Donor')

    def get_all_samples(self, non_metadata_fields):
        return self._get_all_entities_of_type(non_metadata_fields, 'Sample')

    def get_all_datasets(self, non_metadata_fields):
        return self._get_all_entities_of_type(non_metadata_fields, 'Dataset')

    def _get_all_entities_of_type(self, non_metadata_fields, entity_type):
        size = 10000  # Default ES limit
        query = {
            "size": size,
            "post_filter": {
                "term": {"entity_type.keyword": entity_type}
            },
            "_source": [*non_metadata_fields, 'mapped_metadata', 'metadata']
        }
        response_json = self._request(
            current_app.config['ELASTICSEARCH_ENDPOINT']
            + current_app.config['PORTAL_INDEX_PATH'],
            body_json=query)
        sources = [hit['_source'] for hit in response_json['hits']['hits']]
        if len(sources) == size:
            raise Exception('At least 10k datasets: need to make multiple requests')
        return _flatten_sources(sources, non_metadata_fields)

    def get_entity(self, uuid=None, hbm_id=None):
        if self.is_mock:
            return {
                'created': '2020-01-01 00:00:00',
                'modified': '2020-01-01 00:00:00',
                'provenance_user_displayname': 'Chuck McCallum',
                'provenance_user_email': 'mccalluc@example.com',
                'provenance_group_name': 'Mock Group',
                'hubmap_id': 'abcd-1234',
                'description': 'Mock Entity'
            }

        if uuid is not None and hbm_id is not None:
            raise Exception('Only UUID or HBM ID should be provided, not both')
        query = {'query':
                 # ES guarantees that _id is unique, so this is best:
                 {'ids': {'values': [uuid]}}
                 if uuid else
                 {'match': {'hubmap_id.keyword': hbm_id}}
                 # With default mapping, without ".keyword", it splits into tokens,
                 # and we get multiple substring matches, instead of unique match.
                 }

        response_json = self._request(
            current_app.config['ELASTICSEARCH_ENDPOINT']
            + current_app.config['PORTAL_INDEX_PATH'],
            body_json=query)

        hits = response_json['hits']['hits']
        return _get_entity_from_hits(hits, has_token=self.nexus_token, uuid=uuid, hbm_id=hbm_id)

    def get_vitessce_conf_cells(self, entity):
        if self.is_mock:
            return ConfCells(self._get_mock_vitessce_conf(), None)
        # First, try "vis-lifting": Display image pyramids on their parent entity pages.
        image_pyramid_descendants = _get_image_pyramid_descendants(entity)
        if image_pyramid_descendants:
            if len(image_pyramid_descendants) > 1:
                current_app.logger.error(f'Expected only one descendant on {entity["uuid"]}')
            derived_entity = image_pyramid_descendants[0]
            # TODO: Entity structure will change in the future to be consistent
            # about "files". Bill confirms that when the new structure comes in
            # there will be a period of backward compatibility to allow us to migrate.
            derived_entity['files'] = derived_entity['metadata']['files']
            return self.get_vitessce_conf_cells(derived_entity)

        if 'files' not in entity or 'data_types' not in entity:
            return ConfCells(None, None)

        # Otherwise, just try to visualize the data for the entity itself:
        try:
            vc = get_view_config_class_for_data_types(
                entity=entity, nexus_token=self.nexus_token
            )
            return vc.get_conf_cells()
        except Exception:
            message = f'Building vitessce conf threw error: {traceback.format_exc()}'
            current_app.logger.error(message)

            return ConfCells({'error': message}, None)

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


def _flatten_sources(sources, non_metadata_fields):
    '''
    >>> from pprint import pp
    >>> donor_sources = [
    ...     {'uuid': 'abcd1234', 'name': 'Ann',
    ...      'other': 'skipped',
    ...      'mapped_metadata': {'age': [40], 'weight': [150]}
    ...     },
    ...     {'uuid': 'wxyz1234', 'name': 'Bob',
    ...      'mapped_metadata': {'age': [50], 'multi': ['A', 'B', 'C']}
    ...     }]
    >>> pp(_flatten_sources(donor_sources, ['uuid', 'name']))
    [{'uuid': 'abcd1234', 'name': 'Ann', 'age': '40', 'weight': '150'},
     {'uuid': 'wxyz1234', 'name': 'Bob', 'age': '50', 'multi': 'A, B, C'}]

    >>> sample_sources = [
    ...     {'uuid': 'abcd1234',
    ...      'metadata': {'organ': 'belly button',
    ...                   'organ_donor_data': {'example': 'Should remove!'},
    ...                   'metadata': {'example': 'Should remove!'}}
    ...     }]
    >>> pp(_flatten_sources(sample_sources, ['uuid', 'name']))
    [{'uuid': 'abcd1234', 'name': None, 'organ': 'belly button'}]
    '''
    flat_sources = [
        {
            **{
                field: source.get(field)
                for field in non_metadata_fields
            },

            # This gets sample and donor metadata.
            **source.get('metadata', {}),

            # This gets donor metadata, and concatenates nested lists.
            **{
                k: ', '.join(str(s) for s in v)
                for (k, v) in source.get('mapped_metadata', {}).items()
            }
        }
        for source in sources
    ]
    for source in flat_sources:
        if 'assay_type' in source.get('metadata', {}):
            # For donors, this is the metadata in EAV form,
            # for samples, this is a placeholder for dev-search,
            # but for datasets, we want to move it up a level.
            source.update(source['metadata'])

        for field in [
                'metadata',
                # From datasets JSON:
                'dag_provenance_list', 'extra_metadata', 'files_info_alt_path',
                # Dataset TSV columns to hide:
                'antibodies_path', 'contributors_path', 'version',
                # From samples:
                'organ_donor_data', 'living_donor_data']:
            source.pop(field, None)
    return flat_sources


def _get_entity_from_hits(hits, has_token=None, uuid=None, hbm_id=None):
    '''
    >>> _get_entity_from_hits(['fake-hit-1', 'fake-hit-2'])
    Traceback (most recent call last):
    ...
    Exception: ID not unique; got 2 matches

    >>> def error(f):
    ...   try: f()
    ...   except Exception as e: print(type(e).__name__)

    >>> error(lambda: _get_entity_from_hits([], hbm_id='HBM123.XYZ.456'))
    Forbidden

    >>> error(lambda: _get_entity_from_hits([], uuid='0123456789abcdef0123456789abcdef'))
    Forbidden

    >>> error(lambda: _get_entity_from_hits([], uuid='0123456789abcdef0123456789abcdef',
    ...       has_token=True))
    NotFound

    >>> error(lambda: _get_entity_from_hits([], uuid='too-short'))
    NotFound

    >>> _get_entity_from_hits([{'_source': 'fake-entity'}])
    'fake-entity'

    '''
    if len(hits) == 0:
        if (uuid and len(uuid) == 32 or hbm_id) and not has_token:
            # Assume that the UUID is not yet published:
            # UI will suggest logging in.
            abort(403)
        abort(404)
    if len(hits) > 1:
        raise Exception(f'ID not unique; got {len(hits)} matches')
    entity = hits[0]['_source']
    return entity


def _get_image_pyramid_descendants(entity):
    '''
    >>> _get_image_pyramid_descendants({
    ...     'descendants': []
    ... })
    []

    >>> _get_image_pyramid_descendants({
    ...     'descendants': [{'no_data_types': 'should not error!'}]
    ... })
    []

    >>> _get_image_pyramid_descendants({
    ...     'descendants': [{'data_types': ['not_a_pyramid']}]
    ... })
    []

    >>> doc = {'data_types': ['image_pyramid']}
    >>> descendants = _get_image_pyramid_descendants({
    ...     'descendants': [doc]
    ... })
    >>> descendants
    [{'data_types': ['image_pyramid']}]
    >>> assert doc == descendants[0]
    >>> assert id(doc) != id(descendants[0])

    >>> _get_image_pyramid_descendants({
    ...     'descendants': [
    ...         {'data_types': ['not_a_pyramid']},
    ...         {'data_types': ['image_pyramid']}
    ...     ]
    ... })
    [{'data_types': ['image_pyramid']}]

    There shouldn't be multiple image pyramids, but if there are, we should capture all of them:

    >>> _get_image_pyramid_descendants({
    ...     'descendants': [
    ...         {'id': 'A', 'data_types': ['image_pyramid']},
    ...         {'id': 'B', 'data_types': ['not_a_pyramid']},
    ...         {'id': 'C', 'data_types': ['image_pyramid']}
    ...     ]
    ... })
    [{'id': 'A', 'data_types': ['image_pyramid']}, {'id': 'C', 'data_types': ['image_pyramid']}]

    '''
    descendants = entity.get('descendants', [])
    image_pyramid_descendants = [
        d for d in descendants
        if 'image_pyramid' in d.get('data_types', [])
    ]
    return deepcopy(image_pyramid_descendants)
