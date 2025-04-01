from flask import (render_template, current_app, abort,
                   session, request, redirect, url_for)

from .utils import get_default_flask_data, make_blueprint, get_organs


blueprint = make_blueprint(__name__)


@blueprint.route('/')
def index():
    flask_data = {**get_default_flask_data(), 'organs_count': len(get_organs())}
    return render_template(
        'base-pages/react-content.html',
        flask_data=flask_data,
        title='Human BioMolecular Atlas Program Data Portal \
            | Human Tissue Atlas for Biomedical Research',
        description='HuBMAP is a healthy human tissue atlas \
            advancing biomedical research with single-cell, \
                spatial, and molecular data. Explore datasets, \
                    tools, and visualizations.',
        skip_title_suffix=True
    )


@blueprint.route('/services')
def service_status():
    flask_data = {**get_default_flask_data()}
    return render_template(
        'base-pages/react-content.html',
        flask_data=flask_data,
        title='Services'
    )


@blueprint.route('/ccf-eui')
def ccf_eui():
    return render_template(
        'special-pages/ccf-eui.html',
        config=current_app.config,
        url_root=request.url_root,
        groups_token=(
            session['groups_token']
            if 'groups_token' in session
            else ''
        )
    )


@blueprint.route('/search/<type>')
def search(type):
    if type not in ['donors', 'samples', 'datasets']:
        abort(404)
    title = f'{type.capitalize()} Search'
    flask_data = {
        'type': type,
        **get_default_flask_data(),
        'title': title,
    }
    return render_template(
        'base-pages/react-content.html',
        title=title,
        flask_data=flask_data,
    )


@blueprint.route('/search')
def search_redirect():
    entity_type = request.args.get('entity_type[0]')
    return redirect(
        url_for('routes_main.search', type=f'{entity_type}s'.lower()))


@blueprint.route('/dev-search')
def dev_search():
    title = 'Dev Search'
    flask_data = {
        **get_default_flask_data(),
        'title': title,
    }
    return render_template(
        'base-pages/react-content.html',
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
        'base-pages/react-content.html',
        title=title,
        flask_data=flask_data
    )


@blueprint.route('/collections')
def collections():
    flask_data = {**get_default_flask_data()}
    return render_template(
        'base-pages/react-content.html',
        title='Collections | Curated HuBMAP Datasets for Tissue & Molecular Research',
        flask_data=flask_data,
        skip_title_suffix=True
    )


@blueprint.route('/publications')
def publications():
    flask_data = {**get_default_flask_data()}
    return render_template(
        'base-pages/react-content.html',
        title='Publications | HuBMAP Peer-Reviewed Research and Preprints',
        description='Explore publications using HuBMAP data in single-cell and spatial biology. \
            Find peer-reviewed papers, preprints, referenced datasets, \
                and applications in biomolecular research.',
        flask_data=flask_data,
        skip_title_suffix=True
    )


@blueprint.route('/my-lists')
def my_lists():
    flask_data = {**get_default_flask_data()}
    return render_template(
        'base-pages/react-content.html',
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
        'base-pages/react-content.html',
        title='Saved List',
        flask_data=flask_data
    )


@blueprint.route('/iframe/<path:path>')
def iframe_page(path):
    flask_data = {
        **get_default_flask_data(),
        'organs_count': len(get_organs())
    }
    return render_template(
        'special-pages/organ.html' if path == 'organ' else 'base-pages/react-content.html',
        title=f'{path} iframe',
        flask_data=flask_data
    )


@blueprint.route('/tutorials')
def tutorials():
    flask_data = {
        **get_default_flask_data(),
    }
    return render_template(
        'base-pages/react-content.html',
        title='Tutorials',
        flask_data=flask_data
    )


@blueprint.route('/tutorials/<tutorial_name>')
def tutorial_detail(tutorial_name):
    flask_data = {
        **get_default_flask_data(),
        'tutorialName': tutorial_name
    }
    return render_template(
        'base-pages/react-content.html',
        title=tutorial_name,
        flask_data=flask_data
    )


@blueprint.route('/profile')
def profile():
    flask_data = {**get_default_flask_data()}
    return render_template(
        'base-pages/react-content.html',
        title='Profile',
        flask_data=flask_data
    )
