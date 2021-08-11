from io import StringIO
from csv import DictWriter

from flask import Response

from .utils import make_blueprint, get_client


blueprint = make_blueprint(__name__)


@blueprint.route('/api/v0/donors.tsv')
def donors_tsv():
    client = get_client()
    first_fields = ['uuid', 'hubmap_id']
    donors = client.get_all_donors(first_fields)
    return _make_tsv_response(_dicts_to_tsv(donors, first_fields), 'donors.tsv')


@blueprint.route('/api/v0/samples.tsv')
def samples_tsv():
    client = get_client()
    first_fields = ['uuid', 'hubmap_id']
    samples = client.get_all_samples(first_fields)
    return _make_tsv_response(_dicts_to_tsv(samples, first_fields), 'samples.tsv')


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
    ...   {'title': 'The Return of the Jedi', 'date': '1983'}
    ... ]
    >>> from pprint import pp
    >>> pp(_dicts_to_tsv(data_dicts, ['title']))
    ('title\\tdate\\tsubtitle\\r\\n'
     'Star Wars\\t1977\\tA New Hope\\r\\n'
     'The Empire Strikes Back\\t1980\\t\\r\\n'
     'The Return of the Jedi\\t1983\\t\\r\\n')
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
