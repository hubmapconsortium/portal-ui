import json
from urllib.parse import urlparse, quote

from flask import (
    render_template, jsonify,
    abort, request, redirect, url_for, Response)

from .utils import (
    get_default_flask_data, make_blueprint, get_client,
    get_url_base_from_request, entity_types)


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

    # Redirect to primary dataset if this is
    # - a support entity (e.g. an image pyramid)
    # - a processed or component dataset
    is_support = actual_type == 'support'
    is_processed = entity.get('processing') != 'raw'
    is_component = entity.get('is_component', False) is True
    if (is_support or is_processed or is_component):
        supported_entity = client.get_entities(
            'datasets',
            query_override={
                "bool": {
                    "must": {
                        "terms": {
                            "descendant_ids": [uuid]
                        }
                    }
                }
            },
            non_metadata_fields=['hubmap_id', 'uuid']
        )

        pipeline_anchor = entity.get('pipeline', entity.get('hubmap_id')).replace(' ', '')
        anchor = quote(f'section-{pipeline_anchor}-{entity.get("status")}').lower()

        if len(supported_entity) > 0:
            return redirect(
                url_for('routes_browse.details',
                        type='dataset',
                        uuid=supported_entity[0]['uuid'],
                        _anchor=anchor,
                        redirected=True))

    if type != actual_type:
        return redirect(url_for('routes_browse.details', type=actual_type, uuid=uuid))

    redirected = request.args.get('redirected') == 'True'

    flask_data = {
        **get_default_flask_data(),
        'entity': entity,
        'redirected': redirected,
    }

    if type == 'publication':
        publication_ancillary_data = client.get_publication_ancillary_json(entity)
        flask_data.update({'vignette_json': publication_ancillary_data.publication_json})

    template = 'base-pages/react-content.html'
    return render_template(
        template,
        type=type,
        uuid=uuid,
        title=f'{entity["hubmap_id"]} | {type.title()}',
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
    vitessce_conf = client.get_vitessce_conf_cells_and_lifted_uuid(
        entity, marker=marker, parent=parent).vitessce_conf
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
    # For Samples...
    if 'rui_location' in entity:
        return json.loads(entity['rui_location'])
    # For Datasets...
    if 'ancestors' not in entity:
        abort(404)
    located_ancestors = [a for a in entity['ancestors'] if 'rui_location' in a]
    if not located_ancestors:
        abort(404)
    # There may be multiple: The last should be the closest...
    # but this should be confirmed, when there are examples.
    return json.loads(located_ancestors[-1]['rui_location'])


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
