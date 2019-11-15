from urllib.parse import urlencode

from flask import Blueprint, current_app, url_for, request, redirect, session

import globus_sdk


# This is mostly copy-and-paste from
# https://globus-sdk-python.readthedocs.io/en/stable/examples/three_legged_oauth/


blueprint = Blueprint('routes_auth', __name__, template_folder='templates')


def load_app_client():
    return globus_sdk.ConfidentialAppAuthClient(
        current_app.config['APP_CLIENT_ID'], current_app.config['APP_CLIENT_SECRET'])


@blueprint.route('/login')
def login():
    '''
    Login via Globus Auth.
    May be invoked in one of two scenarios:

      1. Login is starting, no state in Globus Auth yet
      2. Returning to application during login, already have short-lived
         code from Globus Auth to exchange for tokens, encoded in a query
         param
    '''
    # The redirect URI, as a complete URI (not relative path)
    redirect_uri = url_for('routes_auth.login', _external=True)

    client = load_app_client()
    client.oauth2_start_flow(redirect_uri)

    # If there's no "code" query string parameter, we're in this route
    # starting a Globus Auth login flow; Redirect out to Globus Auth:
    if 'code' not in request.args:
        auth_uri = client.oauth2_get_authorize_url(
            additional_params={
                'scope': ' '.join([
                    'openid profile email',
                    'urn:globus:auth:scope:transfer.api.globus.org:all',
                    'urn:globus:auth:scope:auth.globus.org:view_identities',
                    'urn:globus:auth:scope:nexus.api.globus.org:groups'
                ])
            }
        )
        return redirect(auth_uri)

    # If we do have a "code" param, we're coming back from Globus Auth
    # and can start the process of exchanging an auth code for a token.
    code = request.args.get('code')
    tokens = client.oauth2_exchange_code_for_tokens(code)
    # The repr is deceptive: Looks like a dict, but direct access not possible.
    nexus_token = tokens.by_resource_server['nexus.api.globus.org']['access_token']

    session.update(
        nexus_token=nexus_token,
        is_authenticated=True
    )
    return redirect(url_for('routes.index'))


@blueprint.route('/logout')
def logout():
    '''
    - Revoke the tokens with Globus Auth.
    - Destroy the session state.
    - Redirect the user to the Globus Auth logout page.
    '''
    client = load_app_client()

    # Revoke the tokens with Globus Auth
    try:
        tokens = session['tokens']
    except Exception as e:
        # TODO: After leaving it logged for several hours, my tokens had expired,
        # but I was still logged in. Is this the best fix?
        tokens = {}
    for token in (token_info['access_token']
                  for token_info in tokens.values()):
        client.oauth2_revoke_token(token)


    # Destroy the session state
    session.clear()

    redirect_uri = url_for('routes.index', _external=True)
    globus_logout_url = 'https://auth.globus.org/v2/web/logout?' + urlencode({
        'client': current_app.config['APP_CLIENT_ID'],
        'redirect_uri': redirect_uri,
        'redirect_name': 'HuBMAP Portal'
    })
    return redirect(globus_logout_url)
