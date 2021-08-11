from os.path import dirname
from io import StringIO
from csv import DictWriter

from flask import (render_template, current_app,
                   session, request)

import frontmatter

from .utils import get_default_flask_data, make_blueprint


blueprint = make_blueprint(__name__)


@blueprint.route('/')
def index():
    flask_data = {**get_default_flask_data()}
    return render_template(
        'pages/base_react.html',
        flask_data=flask_data,
        title='HuBMAP Data Portal',
        is_home_page=True
    )


@blueprint.route('/services')
def service_status():
    flask_data = {**get_default_flask_data()}
    return render_template(
        'pages/base_react.html',
        flask_data=flask_data,
        title='Services'
    )


@blueprint.route('/ccf-eui')
def ccf_eui():
    return render_template(
        'pages/ccf-eui.html',
        config=current_app.config,
        url_root=request.url_root,
        nexus_token=(
            session['nexus_token']
            if 'nexus_token' in session
            else ''
        )
    )


@blueprint.route('/search')
@blueprint.route('/cells-search')
def search():
    entity_type = request.args.get('entity_type[0]')
    title = f'{entity_type}s' if entity_type else 'Search'
    flask_data = {
        **get_default_flask_data(),
        'title': title,
    }
    return render_template(
        'pages/base_react.html',
        title=title,
        flask_data=flask_data,
    )


@blueprint.route('/dev-search')
def dev_search():
    title = 'Dev Search'
    flask_data = {
        **get_default_flask_data(),
        'title': title,
    }
    return render_template(
        'pages/base_react.html',
        title=title,
        flask_data=flask_data
    )


@blueprint.route('/diversity')
def vis():
    title = 'Donor Diversity'
    flask_data = {
        **get_default_flask_data(),
        'title': title
    }
    return render_template(
        'pages/base_react.html',
        title=title,
        flask_data=flask_data
    )


@blueprint.route('/preview/<name>')
def preview_view(name):
    filename = dirname(__file__) + '/preview/' + name + '.md'
    metadata_content = frontmatter.load(filename)
    preview_metadata = metadata_content.metadata
    markdown = metadata_content.content
    flask_data = {
        **get_default_flask_data(),
        'title': preview_metadata['title'],
        'markdown': markdown,
        'entity': {
            'group_name': preview_metadata['group_name'],
            'created_by_user_displayname': preview_metadata['created_by_user_displayname'],
            'created_by_user_email': preview_metadata['created_by_user_email'],
        },
        'vitessce_conf': preview_metadata.get('vitessce_conf')
    }
    return render_template(
        'pages/base_react.html',
        title='Preview',
        flask_data=flask_data
    )


@blueprint.route('/publication/<name>')
def publication_view(name):
    filename = dirname(__file__) + '/publication/' + name + '.md'
    metadata_content = frontmatter.load(filename)
    publication_metadata = metadata_content.metadata
    markdown = metadata_content.content
    flask_data = {
        **get_default_flask_data(),
        'title': publication_metadata['title'],
        'markdown': markdown,
        # Unlike preview, no "entity".
        'vitessce_conf': publication_metadata.get('vitessce_conf')
    }
    return render_template(
        'pages/base_react.html',
        title='Publication',
        flask_data=flask_data
    )


@blueprint.route('/collections')
def collections():
    flask_data = {**get_default_flask_data()}
    return render_template(
        'pages/base_react.html',
        title='Collections',
        flask_data=flask_data
    )


@blueprint.route('/my-lists')
def my_lists():
    flask_data = {**get_default_flask_data()}
    return render_template(
        'pages/base_react.html',
        title='My Lists',
        flask_data=flask_data
    )


@blueprint.route('/my-lists/<saved_list_uuid>')
def list_page(saved_list_uuid):
    flask_data = {
        **get_default_flask_data(),
        'list_uuid': saved_list_uuid
    }
    return render_template(
        'pages/base_react.html',
        title='Saved List',
        flask_data=flask_data
    )


# TODO: Move these, once the routes cleanup is merged:
# https://github.com/hubmapconsortium/portal-ui/pull/2052
@blueprint.route('/api/v0/donors.tsv')
def donors_tsv():
    client = _get_client()
    first_fields = ['uuid', 'hubmap_id']
    donors = client.get_all_donors(first_fields)
    return _make_tsv_response(_dicts_to_tsv(donors, first_fields), 'donors.tsv')


@blueprint.route('/api/v0/samples.tsv')
def samples_tsv():
    client = _get_client()
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
    >>> pp(dicts_to_tsv(data_dicts, ['title']))
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
