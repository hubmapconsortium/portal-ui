from io import StringIO
from csv import DictWriter
from pathlib import Path
from datetime import datetime

from yaml import safe_load

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

    descriptions_path = Path(__name__).absolute().parent.parent / \
        'ingest-validation-tools/docs/field-descriptions.yaml'
    descriptions_dict = safe_load(descriptions_path.read_text())
    tsv = _dicts_to_tsv(entities, _first_fields, descriptions_dict)

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


def _dicts_to_tsv(data_dicts, first_fields, descriptions_dict):
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
    # wrap in default dicts that return 'n/a'
    body_fields = sorted(
        set().union(*[d.keys() for d in data_dicts])
        - set(first_fields)
    )
    for dd in data_dicts:
        for field in body_fields:
            if field not in dd:
                dd[field] = 'N/A'
    output = StringIO()
    writer = DictWriter(output, first_fields + body_fields, delimiter='\t', extrasaction='ignore')
    writer.writeheader()
    writer.writerows([descriptions_dict] + data_dicts)
    tsv = output.getvalue()
    tsv_lines = tsv.split('\n')
    tsv_lines[1] = '#' + tsv_lines[1]
    return '\n'.join(tsv_lines)
