from urllib.parse import urlencode, unquote

from flask import (
    Blueprint, make_response, current_app, url_for,
    request, redirect, render_template, session)
import requests
import globus_sdk


# This is mostly copy-and-paste from
# https://globus-sdk-python.readthedocs.io/en/stable/examples/three_legged_oauth/


blueprint = Blueprint(__name__.split('.')[-1], __name__, template_folder='templates')


def load_app_client():
    return globus_sdk.ConfidentialAppAuthClient(
        current_app.config['APP_CLIENT_ID'], current_app.config['APP_CLIENT_SECRET'])


def has_hubmap_group(nexus_token):
    # Mostly copy-and-paste from
    # https://github.com/hubmapconsortium/commons/blob/dc69f4/hubmap_commons/hm_auth.py#L347-L355
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + nexus_token
    }
    params = {
        'fields': 'id,name,description',
        # I'm not sure what these do, and if they are necessary:
        'for_all_identities': 'false',
        'my_statuses': 'active'
    }
    response = requests.get(
        'https://nexus.api.globusonline.org/groups',
        headers=headers,
        params=params)
    response.raise_for_status()
    groups = response.json()
    return any([group['id'] == current_app.config['GROUP_ID'] for group in groups])


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

    token_object = tokens.by_resource_server['nexus.api.globus.org']
    nexus_token = token_object['access_token']

    auth_token_object = tokens.by_resource_server['auth.globus.org']
    auth_token = auth_token_object['access_token']

    user_info_request_headers = {'Authorization': 'Bearer ' + auth_token}
    user_info = requests.get('https://auth.globus.org/v2/oauth2/userinfo',
                             headers=user_info_request_headers).json()
    user_email = user_info['email'] if 'email' in user_info else ''

    if not has_hubmap_group(nexus_token):
        # Globus institution login worked, but user does not have HuBMAP group!
        return render_template('errors/401-no-hubmap-group.html'), 401

    session.update(
        nexus_token=nexus_token,
        is_authenticated=True,
        user_email=user_email)

    previous_url = unquote(request.cookies.get('urlBeforeLogin'))
    response = make_response(
        redirect(previous_url))
    return response


@blueprint.route('/logout')
def logout():
    '''
    - Revoke the tokens with Globus Auth.
    - Destroy the session state.
    - And when redirect returns, redirect again to the Globus Auth logout page.
    '''
    redirect_to_globus_param = 'redirect_to_globus'

    if redirect_to_globus_param in request.args:
        redirect_uri = url_for('main.index', _external=True)
        globus_logout_url = 'https://auth.globus.org/v2/web/logout?' + urlencode({
            'client': current_app.config['APP_CLIENT_ID'],
            'redirect_uri': redirect_uri,
            'redirect_name': 'HuBMAP Portal'
        })
        return redirect(globus_logout_url)

    client = load_app_client()

    # Revoke the tokens with Globus Auth
    try:
        tokens = session['tokens']
    except Exception:
        # May have only hit this because of weird state during development,
        # but if there are no tokens, there's nothing to revoke.
        tokens = {}
    for token in (token_info['access_token']
                  for token_info in tokens.values()):
        client.oauth2_revoke_token(token)

    # Destroy the session state
    session.clear()

    kwargs = {redirect_to_globus_param: True}
    response = make_response(
        redirect(url_for('routes_auth.logout', _external=True, **kwargs)))
    return response
