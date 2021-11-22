from io import StringIO
from csv import DictWriter

from flask import Response, abort, request, render_template, jsonify

from .utils import make_blueprint, get_client, get_default_flask_data


blueprint = make_blueprint(__name__)


def _get_dict_subset(d, keys_to_remove):
    return {k: d[k] for k in d.keys() - dict.fromkeys(keys_to_remove)}


def _raise_api_error(status, message):
    return jsonify({
        'status': status,
        'message': message,

    })


@blueprint.route('/metadata/v0/<entity_type>.tsv', methods=['GET', 'POST'])
def entities_tsv(entity_type):
    if request.method == 'GET':
        all_args = request.args.to_dict(flat=False)
        constraints = _get_dict_subset(all_args, ['uuids'])
        entities = _get_entities(entity_type, constraints, request.args.getlist('uuids'))
    else:
        body = request.get_json()
        if request.args:
            return _raise_api_error(400, 'POST only accepts a JSON body.')
        if _get_dict_subset(body, ['uuids']):
            return _raise_api_error(400, 'POST only accepts uuids in JSON body.')
        entities = _get_entities(entity_type, {}, body.get('uuids'))
    return _make_tsv_response(_dicts_to_tsv(entities, _first_fields), f'{entity_type}.tsv')


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
        entity_type, extra_fields,
        constraints,
        uuids
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
