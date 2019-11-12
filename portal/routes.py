from flask import Blueprint, current_app, render_template, url_for, abort, request, redirect, session

import globus_sdk

from .api.client import ApiClient
from .render import object_as_html


blueprint = Blueprint('routes', __name__, template_folder='templates')

types = {
    'donor': {'display_name': 'Donors', 'in_header': True},
    'sample': {'display_name': 'Samples', 'in_header': True},
    'dataset': {'display_name': 'Datasets', 'in_header': True},
    'file': {'display_name': 'Files', 'in_header': False}
}


@blueprint.route('/')
def home():
    return render_template('pages/index.html', types=types)


@blueprint.route('/browse/<type>')
def browse(type):
    if type not in types:
        abort(404)
    client = ApiClient('TODO: base url from config')
    entities = client.get_entities(type)
    return render_template('pages/browse.html', types=types, type=type, entities=entities)


@blueprint.route('/browse/<type>/<uuid>')
def details(type, uuid):
    if type not in types:
        abort(404)
    client = ApiClient('TODO: base url from config')

    entity = client.get_entity(uuid)
    contributor = client.get_contributor(entity['contributor_id'])

    details_html = object_as_html(entity)
    provenance = client.get_provenance(uuid)

    if type in {'file'}:  # TODO: As we have other specializations, add them here.
        template = f'pages/details/details_{type}.html'
    else:
        template = f'pages/details/details_base.html'
    return render_template(
        template, types=types, type=type, uuid=uuid,
        entity=entity, contributor=contributor,
        details_html=details_html,
        provenance=provenance
    )


@blueprint.route('/help')
def help():
    return render_template('pages/help.html', types=types)



def load_app_client():
    return globus_sdk.ConfidentialAppAuthClient(
        current_app.config['APP_CLIENT_ID'], current_app.config['APP_CLIENT_SECRET'])


@blueprint.route('/login')
def login():
    """
    Login via Globus Auth.
    May be invoked in one of two scenarios:

      1. Login is starting, no state in Globus Auth yet
      2. Returning to application during login, already have short-lived
         code from Globus Auth to exchange for tokens, encoded in a query
         param
    """
    # the redirect URI, as a complete URI (not relative path)
    redirect_uri = url_for('routes.login', _external=True)

    client = load_app_client()
    client.oauth2_start_flow(redirect_uri)

    # If there's no "code" query string parameter, we're in this route
    # starting a Globus Auth login flow.
    # Redirect out to Globus Auth
    if 'code' not in request.args:
        auth_uri = client.oauth2_get_authorize_url()
        return redirect(auth_uri)
    # If we do have a "code" param, we're coming back from Globus Auth
    # and can start the process of exchanging an auth code for a token.
    else:
        code = request.args.get('code')
        tokens = client.oauth2_exchange_code_for_tokens(code)

        # store the resulting tokens in the session
        session.update(
            tokens=tokens.by_resource_server,
            is_authenticated=True
        )
        return redirect(url_for('routes.home'))


@blueprint.route('/logout')
def logout():
    """
    - Revoke the tokens with Globus Auth.
    - Destroy the session state.
    - Redirect the user to the Globus Auth logout page.
    """
    client = load_app_client()

    # Revoke the tokens with Globus Auth
    for token in (token_info['access_token']
                  for token_info in session['tokens'].values()):
        client.oauth2_revoke_token(token)

    # Destroy the session state
    session.clear()

    # the return redirection location to give to Globus AUth
    redirect_uri = url_for('routes.home', _external=True)

    # build the logout URI with query params
    # there is no tool to help build this (yet!)
    globus_logout_url = (
        'https://auth.globus.org/v2/web/logout' +
        '?client={}'.format(current_app.config['APP_CLIENT_ID']) +
        '&redirect_uri={}'.format(redirect_uri) +
        '&redirect_name=HuBMAP Portal')

    # Redirect the user to the Globus Auth logout page
    return redirect(globus_logout_url)
