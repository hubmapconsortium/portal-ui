from io import StringIO
from csv import DictWriter
from datetime import datetime

from flask import Response, abort, request, render_template, jsonify

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


@blueprint.route('/metadata/v0/<entity_type>.tsv', methods=['GET', 'POST'])
def entities_tsv(entity_type):
    if request.method == 'GET':
        all_args = request.args.to_dict(flat=False)
        constraints = _drop_dict_keys(all_args, ['uuids'])
        uuids = request.args.getlist('uuids')
    else:
        if request.args:
            return _get_api_json_error(400, 'POST only accepts a JSON body.')
        body = request.get_json()
        if _drop_dict_keys(body, ['uuids']):
            return _get_api_json_error(400, 'POST only accepts uuids in JSON body.')
        constraints = {}
        uuids = body.get('uuids')
    entities = _get_entities(entity_type, constraints, uuids)
    timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    filename = f'hubmap-{entity_type}-metadata-{timestamp}.tsv'
    return _make_tsv_response(_dicts_to_tsv(entities, _first_fields), filename)


@blueprint.route('/lineup/<entity_type>')
def lineup(entity_type):
    entities = _get_entities(entity_type, request.args.to_dict(flat=False))
    flask_data = {
        **get_default_flask_data(),
        'entities': entities
    }
    return render_template(
        'pages/base_react.html',
        flask_data=flask_data,
        title=f'Lineup {entity_type}'
    )


_first_fields = ['uuid', 'hubmap_id']


def _get_entities(entity_type, constraints={}, uuids=None):
    if entity_type not in ['donors', 'samples', 'datasets']:
        abort(404)
    client = get_client()
    extra_fields = _first_fields[:]
    if entity_type in ['samples', 'datasets']:
        extra_fields.append('donor.hubmap_id')
    if entity_type in ['samples']:
        extra_fields.append('mapped_specimen_type')
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


def _dicts_to_tsv(data_dicts, first_fields):
    '''
    >>> data_dicts = [
    ...   {'title': 'Star Wars', 'subtitle': 'A New Hope', 'date': '1977'},
    ...   {'title': 'The Empire Strikes Back', 'date': '1980'},
    ...   {'title': 'Return of the Jedi', 'date': '1983'}
    ... ]
    >>> from pprint import pp
    >>> pp(_dicts_to_tsv(data_dicts, ['title']))
    ('title\\tdate\\tsubtitle\\r\\n'
     'Star Wars\\t1977\\tA New Hope\\r\\n'
     'The Empire Strikes Back\\t1980\\t\\r\\n'
     'Return of the Jedi\\t1983\\t\\r\\n')
    '''
    body_fields = sorted(
        set().union(*[d.keys() for d in data_dicts])
        - set(first_fields)
    )
    output = StringIO()
    writer = DictWriter(output, first_fields + body_fields, delimiter='\t')
    writer.writeheader()
    writer.writerows(data_dicts)
    return output.getvalue()
