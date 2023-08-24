from urllib.parse import urlencode, unquote
from datetime import datetime

from flask import (
    make_response, current_app, url_for,
    request, redirect, session)
import requests
import globus_sdk
from json import dumps, load
from hubmap_commons.hm_auth import AuthCache

from .utils import make_blueprint


# This is mostly copy-and-paste from
# https://globus-sdk-python.readthedocs.io/en/stable/examples/three_legged_oauth/


blueprint = make_blueprint(__name__)


def load_app_client():
    return globus_sdk.ConfidentialAppAuthClient(
        current_app.config['APP_CLIENT_ID'], current_app.config['APP_CLIENT_SECRET'])


def get_globus_groups(groups_token):
    # Mostly copy-and-paste from
    # https://github.com/hubmapconsortium/commons/blob/641d03b0dc/hubmap_commons/hm_auth.py#L626-L646
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + groups_token
    }
    response = requests.get(
        'https://groups.api.globus.org/v2/groups/my_groups',
        headers=headers)
    response.raise_for_status()
    groups = response.json()
    return groups


def has_globus_group(groups, group_id):
    return any([group['id'] == group_id for group in groups])


def get_ip():
    # From https://stackoverflow.com/a/49760261
    if request.environ.get('HTTP_X_FORWARDED_FOR') is None:
        return f"{request.environ['REMOTE_ADDR']} - direct"
    else:
        return f"{request.environ['HTTP_X_FORWARDED_FOR']} - proxied"


def log(message):
    # TODO: Remove logging when issue is understood / fixed.
    # https://github.com/hubmapconsortium/portal-ui/issues/2518#issuecomment-1195627127
    current_app.logger.info(f'routes_auth: {message} [IP: {get_ip()}]')


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
    log('1/4: oauth2_start_flow')
    client.oauth2_start_flow(redirect_uri)

    # If there's no "code" query string parameter, we're in this route
    # starting a Globus Auth login flow; Redirect out to Globus Auth:
    if 'code' not in request.args:
        log('2: oauth2_get_authorize_url')
        auth_uri = client.oauth2_get_authorize_url(
            query_params={
                'scope': ' '.join([
                    'openid profile email',
                    'urn:globus:auth:scope:transfer.api.globus.org:all',
                    'urn:globus:auth:scope:auth.globus.org:view_identities',
                    'urn:globus:auth:scope:groups.api.globus.org:all'
                ])
            }
        )
        log('3: redirect auth_url')
        return redirect(auth_uri)

    # If we do have a "code" param, we're coming back from Globus Auth
    # and can start the process of exchanging an auth code for a token.
    code = request.args.get('code')
    log('5: oauth2_exchange_code_for_tokens')
    tokens = client.oauth2_exchange_code_for_tokens(code)
    # The repr is deceptive: Looks like a dict, but direct access not possible.

    token_object = tokens.by_resource_server['groups.api.globus.org']
    groups_token = token_object['access_token']

    auth_token_object = tokens.by_resource_server['auth.globus.org']
    auth_token = auth_token_object['access_token']

    # This could be defered until someone actually tries to access the workspaces, but:
    # - This network request could potentially be slow... Lump it with the other slows.
    # - If you're logged in, you should be logged in all the way... Easier to debug.
    workspaces_post_url = current_app.config['WORKSPACES_ENDPOINT'] + '/tokens/'
    workspaces_post_data = dumps({'auth_token': groups_token})
    workspaces_post_resp = requests.post(
        workspaces_post_url,
        data=workspaces_post_data)

    try:
        workspaces_token = workspaces_post_resp.json()['token']
    except Exception as e:
        if not workspaces_post_resp.ok:
            current_app.logger.error(
                'Workspaces auth failed: '
                f'{workspaces_post_resp.status_code} {workspaces_post_resp.text[:100]}')
        else:
            current_app.logger.error(f'Workspaces auth token read failed: {e}')
        workspaces_token = ''  # None would serialize to "None" ... which is no longer false-y.

    user_info_request_headers = {'Authorization': 'Bearer ' + auth_token}
    log('6: userinfo')
    user_info = requests.get('https://auth.globus.org/v2/oauth2/userinfo',
                             headers=user_info_request_headers).json()
    user_email = user_info['email'] if 'email' in user_info else ''

    user_globus_groups = get_globus_groups(groups_token)

    with open(AuthCache.groupJsonFilename) as globus_groups_file:
        globus_groups = load(globus_groups_file)

    permission_groups = {
        'HuBMAP': current_app.config['GROUP_ID'],
        'Workspaces': current_app.config['WORKSPACES_GROUP_ID']
    }

    # Determine if the user belongs to any of the groups in the globus groups master list
    user_internal_hubmap_groups = [
        g for g in globus_groups if user_globus_groups and has_globus_group(
            user_globus_groups, g.get('uuid'))]

    # If user belongs to any internal hubmap groups, they are an internal user
    is_internal_user = len(user_internal_hubmap_groups) > 0

    user_permission_groups = [k for k, group_id in permission_groups.items(
    ) if has_globus_group(user_globus_groups, group_id)]

    session.update(
        groups_token=groups_token,
        is_authenticated=True,
        user_email=user_email,
        workspaces_token=workspaces_token,
        user_groups=user_permission_groups
    )

    previous_url = unquote(request.cookies.get('urlBeforeLogin'))
    response = make_response(
        redirect(previous_url))

    # Set cookies used in trackers.js:
    if (is_internal_user):
        response.set_cookie(
            key='last_login',
            value=datetime.now().isoformat(),
            expires=2**31 - 1)
    else:
        # If the user is not internal, we don't want the last_login cookie to be set
        response.set_cookie(key='last_login', value='', expires=0)

    # Always set this cookie, even if the user is not internal, so that we can
    # more easily track engagement with the portal by institution
    # Using a pipe-delimited list of group names to avoid corruption from ascii encoding commas
    user_groups = 'none' if not user_globus_groups else '|'.join(
        g.get('name') for g in user_globus_groups)
    response.set_cookie(key='user_groups', value=user_groups, expires=2**31 - 1)

    log('7: redirect previous_url')
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
        redirect_uri = url_for('routes_main.index', _external=True)
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
    # Reset cookies used in trackers.js:
    response.set_cookie(key="last_login", value="", max_age=0)
    response.set_cookie(key="user_groups", value="none", max_age=0)
    return response
