from functools import cache
import json
from urllib.parse import urlparse, quote

from flask import (
    current_app, render_template, jsonify,
    abort, request, redirect, url_for, Response)

from .utils import (
    get_default_flask_data, make_blueprint, get_client,
    get_url_base_from_request, entity_types, find_raw_dataset_ancestor,
    should_redirect_entity)


blueprint = make_blueprint(__name__)


@blueprint.route('/browse/<possible_hbm_id>')
def hbm_redirect(possible_hbm_id):
    uppercase_possible_hmb_id = possible_hbm_id.upper()
    if not uppercase_possible_hmb_id.startswith('HBM'):
        abort(404)
    client = get_client()
    entity = client.get_entity(hbm_id=uppercase_possible_hmb_id)
    return redirect(
        url_for('routes_browse.details', type=entity['entity_type'].lower(), uuid=entity['uuid']))


@blueprint.route('/browse/latest/<type>/<uuid>')
def latest_redirect(type, uuid):
    client = get_client()
    latest_entity_uuid = client.get_latest_entity_uuid(uuid, type)
    return redirect(
        url_for('routes_browse.details', type=type.lower(), uuid=latest_entity_uuid))


@blueprint.route('/browse/<type>/<uuid>.<unknown_ext>')
def unknown_ext(type, uuid, unknown_ext):
    # https://github.com/pallets/werkzeug/blob/b01fa1817343d2a36a9d8bb17f61ddf209c27c2b/src/werkzeug/routing.py#L1126
    # Rules with static parts come before variable routes...
    # so the known extensions will come before this.
    abort(404)


@blueprint.route('/browse/<type>/<uuid>')
def details(type, uuid):
    if type not in entity_types:
        abort(404)
    client = get_client()
    entity = client.get_entity(uuid)
    actual_type = entity['entity_type'].lower()

    if (should_redirect_entity(entity)):
        raw_dataset = find_raw_dataset_ancestor(client, entity.get('ancestor_ids'))

        pipeline_anchor = entity.get('pipeline', entity.get('hubmap_id')).replace(' ', '')
        anchor = quote(f'section-{pipeline_anchor}-{entity.get("status")}').lower()

        if raw_dataset is None or len(raw_dataset) == 0:
            abort(404)

        marker = request.args.get('marker') or None

        # Redirect to the primary dataset
        return redirect(
            url_for('routes_browse.details',
                    type='dataset',
                    uuid=raw_dataset[0].get('uuid'),
                    _anchor=anchor,
                    redirected=True,
                    redirectedFromId=entity.get('hubmap_id'),
                    redirectedFromPipeline=entity.get('pipeline'),
                    marker=marker))

    if type != actual_type:
        return redirect(url_for('routes_browse.details', type=actual_type, uuid=uuid))

    redirected = request.args.get('redirected') == 'True'

    flask_data = {
        **get_default_flask_data(),
        'entity': entity,
        'redirected': redirected,
        'redirectedFromId': request.args.get('redirectedFromId'),
        'redirectedFromPipeline': request.args.get('redirectedFromPipeline')
    }

    if type == 'publication':
        publication_ancillary_data = client.get_publication_ancillary_json(entity)
        flask_data.update({'vignette_json': publication_ancillary_data.publication_json})

    template = 'base-pages/react-content.html'
    return render_template(
        template,
        type=type,
        uuid=uuid,
        title=_get_entity_title(entity),
        description=_get_entity_description(entity),
        flask_data=flask_data
    )


@blueprint.route('/browse/<type>/<uuid>.json')
def details_json(type, uuid):
    if type not in entity_types:
        abort(404)
    client = get_client()
    entity = client.get_entity(uuid)
    return entity


@blueprint.route('/browse/<type>/<uuid>.vitessce.json')
def details_vitessce(type, uuid):
    if type not in entity_types:
        abort(404)
    client = get_client()
    entity = client.get_entity(uuid)
    parent_uuid = request.args.get('parent') or None
    marker = request.args.get('marker') or None
    parent = client.get_entity(parent_uuid) if parent_uuid else None
    epic_uuid = None
    if 'segmentation_mask' in entity.get('vitessce-hints') and entity.get(
            'status') != 'Error':
        if parent is None:
            ancestors = entity.get('immediate_ancestor_ids')
            if len(ancestors) > 0:
                parent = ancestors[0]
        if 'epic' in entity.get('vitessce-hints'):
            epic_uuid = uuid

    vitessce_conf = client.get_vitessce_conf_cells_and_lifted_uuid(
        entity,
        marker=marker,
        parent=parent,
        epic_uuid=epic_uuid,
    ).vitessce_conf
    # Returns a JSON null if there is no visualization.
    response = jsonify(vitessce_conf.conf)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@blueprint.route('/browse/<type>/<uuid>.rui.json')
def details_rui_json(type, uuid):
    # Note that the API returns a blob of JSON as a string,
    # so, to return a JSON object, and not just a string, we need to decode.
    if type not in entity_types:
        abort(404)
    client = get_client()
    entity = client.get_entity(uuid)
    # For samples and datasets, the nearest RUI location is indexed with the entity itself.
    # https://github.com/hubmapconsortium/search-api/pull/860
    if 'rui_location' in entity:
        return json.loads(entity['rui_location'])
    # Otherwise throw 404
    abort(404)


@blueprint.route('/sitemap.txt')
def sitemap_txt():
    client = get_client()
    uuids = client.get_all_dataset_uuids()
    url_base = get_url_base_from_request()
    return Response(
        '\n'.join(
            f'{url_base}/browse/dataset/{uuid}' for uuid in uuids
        ),
        mimetype='text/plain')


@blueprint.route('/robots.txt')
def robots_txt():
    allowed_hostname = 'portal.hubmapconsortium.org'
    hostname = urlparse(request.base_url).hostname
    disallow = '/search' if hostname == allowed_hostname else '/'
    return Response(
        f'''
# This host: {hostname}
# Allowed host: {allowed_hostname}
User-agent: *
Disallow: {disallow}
Sitemap: {get_url_base_from_request()}/sitemap.txt
''',
        mimetype='text/plain')


def _format_donor_title(metadata):
    """
    Formats the donor title based on the metadata.
    <Age> <Age Unit> <Race> <Sex>
    >>> _format_donor_title(None)
    'unknown age unknown race unknown sex'
    >>> _format_donor_title({
    ...     'age_value': ['70'],
    ...     'age_unit': ['years old'],
    ...     'race': ['White'],
    ...     'sex': ['Male']})
    '70 years old White Male'
    """

    age = 'unknown age'
    race = 'unknown race'
    sex = 'unknown sex'
    if metadata is not None:
        age_value = metadata.get('age_value')
        age_unit = metadata.get('age_unit')
        if age_value is not None and age_unit is not None:
            age = f'{age_value[0]} {age_unit[0]}'
        if metadata.get('race') is not None:
            race = metadata.get('race')[0]
        if metadata.get('sex') is not None:
            sex = metadata.get('sex')[0]

    return f'{age} {race} {sex}'


def _format_dataset_title(entity):
    """
    Returns a dataset's title, or formats a dataset title based on the metadata.
    <Assay> of <Organ> of <Donor>
    >>> _format_dataset_title(None)
    'unknown assay of unknown organ of unknown donor'
    >>> _format_dataset_title({
    ...     'raw_dataset_type': 'Histology',
    ...     'origin_samples_unique_mapped_organs': ['Kidney'],
    ...     'donor': {
    ...         'mapped_metadata': {
    ...             'age_value': ['70'],
    ...             'age_unit': ['years old'],
    ...             'race': ['White'],
    ...             'sex': ['Male']
    ...         }
    ...     }
    ... })
    'Histology of Kidney of 70 years old White Male'
    >>> _format_dataset_title({
    ...     'title': 'Sample Title'
    ... })
    'Sample Title'
    """
    if (entity is None):
        return 'unknown assay of unknown organ of unknown donor'
    if (entity.get('title') is not None):
        return entity["title"]
    else:
        assay = entity.get('raw_dataset_type', 'unknown assay')
        origin_organs = entity.get('origin_samples_unique_mapped_organs')
       organ = ', '.join(origin_organs) if origin_organs else 'unknown organ'

        donor = entity.get('donor')
        donor_description = _format_donor_title(
            donor.get('mapped_metadata') if donor is not None else None)
        return f'{assay} of {organ} of {donor_description}'


def _format_sample_title(entity):
    """
    Formats a sample title based on the metadata.
    <category> from <organ> of <donor>
    >>> _format_sample_title(None)
    'unknown sample type from unknown organ of unknown donor'
    >>> _format_sample_title({
    ...     'mapped_sample_category': 'Section',
    ...     'origin_samples_unique_mapped_organs': ['Kidney'],
    ...     'donor': {
    ...         'mapped_metadata': {
    ...             'age_value': ['70'],
    ...             'age_unit': ['years old'],
    ...             'race': ['White'],
    ...             'sex': ['Male']
    ...         }
    ...     }
    ... })
    'Section from Kidney of 70 years old White Male'
    """
    if (entity is None):
        return 'unknown sample type from unknown organ of unknown donor'
    sample_category = entity.get('mapped_sample_category', 'Unknown sample type')
    origin_organs = entity.get('origin_samples_unique_mapped_organs')
    if len(origin_organs) > 0:
        organ = origin_organs[0]
    else:
        organ = 'unknown organ'
    donor = entity.get('donor')
    donor_description = _format_donor_title(
        donor.get('mapped_metadata') if donor is not None else None)
    return f'{sample_category} from {organ} of {donor_description}'


def _truncate_title(title):
    """
    Truncates the title to 50 characters and adds ellipsis if necessary.
    >>> _truncate_title('This is a very long title that exceeds fifty characters')
    'This is a very long title that exceeds fifty chara...'
    """
    if len(title) > 50:
        title = title[0:50] + '...'
    return title


def _get_entity_title(entity):
    """
    Formats the meta title for entity detail pages.
    """
    entity_type = entity.get('entity_type', '').lower()
    match entity_type:
        case 'dataset':
            return f'{_format_dataset_title(entity)} | Dataset'
        case 'sample':
            return f'{_format_sample_title(entity)} | Sample'
        case 'publication':
            title = _truncate_title(entity.get('title', entity.get('hubmap_id')))
            return f'{title} | Publication'
        case 'collection':
            title = _truncate_title(entity.get('title', entity.get('hubmap_id')))
            return f'{title} | Collection'
        case 'donor':
            title = _format_donor_title(entity.get("mapped_metadata"))
            return f'{title} | Donor'
        case _:
            return f'{entity["hubmap_id"]} | {entity_type.title()}'


@cache
def _get_publication_data_types_and_organs(uuid: str):
    """
    Retrieves an aggregation of all data types and organs associated with the publication.
    This is used to generate the meta description for the publication detail page.
    """
    client = get_client()

    elasticsearch_url = current_app.config['ELASTICSEARCH_ENDPOINT'] + \
        current_app.config['PORTAL_INDEX_PATH']

    # TODO: the search API client does not currently support aggs, so this is
    # an inline definition for the time being.
    request = {
        "query": {
            "bool": {"must": [
                {"bool": {"filter": [{"term": {"descendant_ids": uuid}}]}},
                {"bool": {"must_not": [{"exists": {"field": "next_revision_uuid"}},
                                       {"exists": {"field": "sub_status"}}]}}]}},
        "aggs": {
            "data_types": {"terms": {"field": "mapped_data_types.keyword", "size": 10000}},
            "organs": {"terms": {"field": "origin_samples.mapped_organ.keyword", "size": 10000}},
        },
        "size": 0
    }

    data_types, organs = [[], []]
    try:
        response = client._request(elasticsearch_url, request)
        aggregations = response.get('aggregations')
        data_types = [bucket.get('key')
                      for bucket in aggregations.get('data_types').get('buckets')]
        organs = [bucket.get('key') for bucket in aggregations.get('organs').get('buckets')]
    except Exception as e:
        current_app.logger.error(f'Error retrieving publication data types and organs: {e}')
    finally:
        return data_types, organs


def _get_entity_description(entity):
    """
    Formats the meta description for entity detail pages.
    """
    entity_type = entity.get('entity_type', '').lower()
    match entity_type:
        case 'dataset':
            return f'Explore the {_format_dataset_title(entity)} dataset from HuBMAP. \
                Access and download metadata, visualizations, and analysis tools for research.'
        case 'sample':
            return f'Explore a {_format_sample_title(entity)}. \
                View metadata and associated datasets for research.'
        case 'publication':
            title = entity.get('title', entity.get('hubmap_id'))
            data_types, organs = _get_publication_data_types_and_organs(entity.get('uuid'))
            return f'Explore HuBMAP publication "{title}", \
                featuring data from {", ".join(data_types)} from {", ".join(organs)}. \
                Access referenced datasets and related visualizations.'
        case 'collection':
            title = entity.get('title', entity.get('hubmap_id'))
            return f'Explore {title} dataset collection. Browse referenced HuBMAP datasets.'
        case 'donor':
            donor_description = _format_donor_title(entity.get('mapped_metadata'))
            return f'Explore {donor_description} HuBMAP donor. \
                Browse metadata and associated datasets, \
                    and tissue samples for research applications.'
        case _:
            return f'{entity["hubmap_id"]} | {entity_type.title()}'
