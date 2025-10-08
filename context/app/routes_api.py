from functools import cache
from io import StringIO
from csv import DictWriter
from datetime import datetime
from typing import Optional

import requests

from flask import Response, abort, request, render_template, jsonify, current_app, make_response

from .utils import make_blueprint, get_client, get_default_flask_data


blueprint = make_blueprint(__name__)


def _drop_dict_keys(d, keys_to_remove):
    '''
    >>> d = {'apple': 'a', 'pear': 'p'}
    >>> _drop_dict_keys(d, ['apple'])
    {'pear': 'p'}
    '''
    return {k: d[k] for k in d.keys() - keys_to_remove}


def _get_api_json_error(status, message):
    return jsonify({
        'status': status,
        'message': message,

    })


def _extract_uuids_and_constraints(all_args, use_list=False):
    constraints = _drop_dict_keys(all_args, ['uuids'])
    if (use_list):
        uuids = request.args.getlist('uuids')
    else:
        uuids = request.args.get('uuids')
        if uuids:
            uuids = uuids.split(',')
        else:
            uuids = None
    return uuids, constraints


def _get_recent_description(descriptions):
    cedar_descriptions = [d for d in descriptions if d['source'] == "CEDAR"]
    return (cedar_descriptions if cedar_descriptions else descriptions)[0]['description']


@blueprint.route('/metadata/descriptions', methods=['GET'])
def metadata_descriptions():
    client = get_client()
    field_descriptions = client.get_metadata_descriptions()
    return {d['name']: _get_recent_description(d['descriptions']) for d in field_descriptions}


def _generate_tsv_response(
    entity_type: str,
    with_descriptions: bool = True,
    cors_origin: Optional[str] = None
):
    if request.method == 'GET':
        all_args = request.args.to_dict(flat=False)
        uuids, constraints = _extract_uuids_and_constraints(all_args, use_list=True)
    else:
        if request.args:
            return _get_api_json_error(400, 'POST only accepts a JSON body.')
        body = request.get_json()
        if _drop_dict_keys(body, ['uuids']):
            return _get_api_json_error(400, 'POST only accepts uuids in JSON body.')
        constraints = {}
        uuids = body.get('uuids')

    entities = _get_entities(entity_type, constraints, uuids)

    if with_descriptions:
        descriptions_dict = metadata_descriptions()
        tsv = _dicts_to_tsv(entities, _first_fields, descriptions_dict)
    else:
        tsv = _dicts_to_tsv(entities, _first_fields)

    timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    filename = f'hubmap-{entity_type}-metadata-{timestamp}.tsv'

    response = make_response(tsv)
    response.headers['Content-Type'] = 'text/tab-separated-values; charset=utf-8'
    response.headers['Content-Disposition'] = f'attachment; filename={filename}'

    if cors_origin:
        response.headers['Access-Control-Allow-Origin'] = cors_origin

    return response


@blueprint.route('/metadata/v0/<entity_type>.tsv', methods=['GET', 'POST'])
def entities_tsv(entity_type):
    return _generate_tsv_response(entity_type, with_descriptions=True)


# This endpoint is for the UDI demo site - produces plain TSV without descriptions and
# removes CORS block.
@blueprint.route('/metadata/v0/udi/<entity_type>.tsv', methods=['GET', 'POST'])
def entities_plain_tsv(entity_type):
    return _generate_tsv_response(
        entity_type,
        with_descriptions=False,
        cors_origin='https://hms-dbmi.github.io'
    )


@blueprint.route('/lineup/<entity_type>')
def lineup(entity_type):
    flask_data = {
        **get_default_flask_data(),
    }
    return render_template(
        'base-pages/react-content.html',
        flask_data=flask_data,
        title=f'Lineup {entity_type}'
    )


_first_fields = ['uuid', 'hubmap_id']


def _get_entities(entity_type, constraints={}, uuids=None):
    if entity_type not in ['donors', 'samples', 'datasets']:
        abort(404)
    client = get_client()
    extra_fields = _first_fields[:]
    extra_fields += [
        # Version number is not in document:
        # We hit the API at render-time to determine it.

        # Publication Date
        'published_timestamp',

        # Last Modified
        'last_modified_timestamp',

        # Creation Date
        'created_timestamp',

        # Status
        'status',
        'mapped_status'

        # Access
        'data_access_level',

        # Consortium
        'mapped_consortium',

        # Affiliation - Group
        'group_name',

        # Affiliation - Registered By
        'created_by_user_displayname',
        'created_by_user_email',
    ]
    if entity_type in ['samples', 'datasets']:
        extra_fields += ['donor.hubmap_id', 'origin_samples_unique_mapped_organs']
    if entity_type in ['samples']:
        extra_fields += ['sample_category']
    entities = client.get_entities(
        plural_lc_entity_type=entity_type, non_metadata_fields=extra_fields,
        constraints=constraints,
        uuids=uuids
        # Default "True" would throw away repeated keys after the first.
    )
    return entities


def _make_tsv_response(tsv_content, filename):
    return Response(
        response=tsv_content,
        headers={'Content-Disposition': f"attachment; filename={filename}"},
        mimetype='text/tab-separated-values'
    )


def _dicts_to_tsv(data_dicts, first_fields, descriptions_dict=None):
    '''
    >>> data_dicts = [
    ...   # explicit subtitle
    ...   {'title': 'Star Wars', 'subtitle': 'A New Hope', 'date': '1977'},
    ...   # empty subtitle
    ...   {'title': 'The Empire Strikes Back', 'subtitle': '', 'date': '1980'},
    ...   # N/A subtitle
    ...   {'title': 'Return of the Jedi', 'date': '1983'}
    ... ]
    >>> descriptions_dict = {
    ...   'title': 'main title',
    ...   'date': 'date released',
    ...   'extra': 'should be ignored'
    ... }
    >>> lines = _dicts_to_tsv(data_dicts, ['title'], descriptions_dict).split('\\r\\n')
    >>> for line in lines:
    ...   print('| ' + ' | '.join(line.split('\\t')) + ' |')
    | title | date | subtitle |
    | #main title | date released |  |
    | Star Wars | 1977 | A New Hope |
    | The Empire Strikes Back | 1980 |  |
    | Return of the Jedi | 1983 | N/A |
    |  |
    '''
    body_fields = sorted(
        set().union(*[d.keys() for d in data_dicts]) - set(first_fields)
    )
    for dd in data_dicts:
        for field in body_fields:
            if field not in dd:
                dd[field] = 'N/A'

    output = StringIO()
    field_names = first_fields + body_fields
    writer = DictWriter(output, field_names, delimiter='\t', extrasaction='ignore')
    writer.writeheader()

    # Conditionally add descriptions row
    if descriptions_dict:
        writer.writerows([descriptions_dict] + data_dicts)
        tsv = output.getvalue()
        tsv_lines = tsv.split('\n')
        tsv_lines[1] = '#' + tsv_lines[1]
        return '\n'.join(tsv_lines)
    else:
        writer.writerows(data_dicts)
        return output.getvalue()


@cache
@blueprint.route('/api/globus-groups.json')
def get_globus_groups():
    # The globus auth helper from hubmap_commons omits the group descriptions,
    # so we need to fetch the full list of groups from the repo.
    groups = requests.get(current_app.config['GLOBUS_GROUPS_URL']).json()
    return groups
