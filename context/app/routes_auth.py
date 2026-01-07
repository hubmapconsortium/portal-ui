from urllib.parse import urlencode, unquote, urlparse
from datetime import datetime

from flask import make_response, current_app, url_for, request, redirect, session
import requests
import globus_sdk
from json import dumps
from hubmap_commons.hm_auth import AuthHelper

from .utils import make_blueprint


# This is mostly copy-and-paste from
# https://globus-sdk-python.readthedocs.io/en/stable/examples/three_legged_oauth/


blueprint = make_blueprint(__name__)


def load_app_client():
    return globus_sdk.ConfidentialAppAuthClient(
        current_app.config['APP_CLIENT_ID'], current_app.config['APP_CLIENT_SECRET']
    )


def get_globus_groups(groups_token):
    # Mostly copy-and-paste from
    # https://github.com/hubmapconsortium/commons/blob/641d03b0dc/hubmap_commons/hm_auth.py#L626-L646

    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + groups_token,
    }

    response = requests.get('https://groups.api.globus.org/v2/groups/my_groups', headers=headers)

    response.raise_for_status()
    groups = response.json()
    return groups


def has_globus_group(groups, group_id):
    return any([group['id'] == group_id for group in groups])


def get_ip():
    # From https://stackoverflow.com/a/49760261
    if request.environ.get('HTTP_X_FORWARDED_FOR') is None:
        return f'{request.environ["REMOTE_ADDR"]} - direct'
    else:
        return f'{request.environ["HTTP_X_FORWARDED_FOR"]} - proxied'


def log(message):
    # TODO: Remove logging when issue is understood / fixed.
    # https://github.com/hubmapconsortium/portal-ui/issues/2518#issuecomment-1195627127
    current_app.logger.info(f'routes_auth: {message} [IP: {get_ip()}]', extra={})


GLOBUS_AUTH_SCOPE = ' '.join(
    [
        'openid profile email',
        'urn:globus:auth:scope:transfer.api.globus.org:all',
        'urn:globus:auth:scope:auth.globus.org:view_identities',
        'urn:globus:auth:scope:groups.api.globus.org:all',
    ]
)


def extract_tokens_from_globus_response(tokens):
    """
    Extract groups and auth tokens from Globus OAuth2 token response.

    Args:
        tokens: Globus SDK token response object

    Returns:
        tuple: (groups_token, auth_token) - both strings, empty if not found

    >>> class MockTokens:
    ...     def __init__(self, by_resource_server):
    ...         self.by_resource_server = by_resource_server
    >>> mock_tokens = MockTokens({
    ...     'groups.api.globus.org': {'access_token': 'groups_token_123'},
    ...     'auth.globus.org': {'access_token': 'auth_token_456'}
    ... })
    >>> extract_tokens_from_globus_response(mock_tokens)
    ('groups_token_123', 'auth_token_456')
    >>> extract_tokens_from_globus_response(None)
    ('', '')
    """
    if not tokens:
        return '', ''

    token_object = tokens.by_resource_server.get('groups.api.globus.org', {})
    groups_token = token_object.get('access_token', '')

    auth_token_object = tokens.by_resource_server.get('auth.globus.org', {})
    auth_token = auth_token_object.get('access_token', '')

    return groups_token, auth_token


def parse_user_name(full_name):
    """
    Split full name into first and last names.

    Args:
        full_name: Full name string

    Returns:
        tuple: (first_name, last_name)

    >>> parse_user_name('John Doe')
    ('John', 'Doe')
    >>> parse_user_name('Jane Mary Smith')
    ('Jane', 'Mary Smith')
    >>> parse_user_name('Madonna')
    ('Madonna', '')
    >>> parse_user_name('')
    ('', '')
    """
    if not full_name:
        return '', ''
    parts = full_name.split(' ')
    first_name = parts[0]
    last_name = ' '.join(parts[1:])
    return first_name, last_name


def extract_user_info_from_globus(user_info):
    """
    Extract user information from Globus userinfo response.

    Args:
        user_info: Dict containing Globus user info

    Returns:
        dict: Extracted user information with keys: email, name, first_name, last_name, id, affiliation

    >>> user_info = {
    ...     'email': 'user@example.com',
    ...     'name': 'John Doe',
    ...     'sub': 'globus_id_123',
    ...     'organization': 'Example Org'
    ... }
    >>> result = extract_user_info_from_globus(user_info)
    >>> result['email']
    'user@example.com'
    >>> result['first_name']
    'John'
    >>> result['last_name']
    'Doe'
    >>> result['id']
    'globus_id_123'
    >>> extract_user_info_from_globus({})
    {'email': '', 'name': '', 'first_name': '', 'last_name': '', 'id': '', 'affiliation': ''}
    """
    user_email = user_info.get('email', '')
    user_name = user_info.get('name', '')
    user_first_name, user_last_name = parse_user_name(user_name)
    user_globus_id = user_info.get('sub', '')
    user_globus_affiliation = user_info.get('organization', '')

    return {
        'email': user_email,
        'name': user_name,
        'first_name': user_first_name,
        'last_name': user_last_name,
        'id': user_globus_id,
        'affiliation': user_globus_affiliation,
    }


def determine_user_permissions(user_globus_groups, globus_groups, permission_groups):
    """
    Determine user's internal status and permission groups.

    Args:
        user_globus_groups: List of user's Globus groups
        globus_groups: List of all HuBMAP Globus groups
        permission_groups: Dict mapping permission names to group IDs

    Returns:
        tuple: (is_internal_user, user_permission_groups, user_internal_hubmap_groups)

    >>> user_groups = [{'id': 'group1', 'name': 'Team A'}, {'id': 'hubmap_group', 'name': 'HuBMAP'}]
    >>> all_groups = [{'uuid': 'hubmap_group', 'name': 'HuBMAP Internal'}]
    >>> perms = {'HuBMAP': 'hubmap_group', 'Workspaces': 'workspace_group'}
    >>> is_internal, user_perms, internal_groups = determine_user_permissions(user_groups, all_groups, perms)
    >>> is_internal
    True
    >>> 'HuBMAP' in user_perms
    True
    >>> len(internal_groups)
    1
    >>> determine_user_permissions([], [], {})
    (False, [], [])
    """
    if not user_globus_groups:
        return False, [], []

    # Determine if the user belongs to any of the groups in the globus groups master list
    user_internal_hubmap_groups = [
        g for g in globus_groups if has_globus_group(user_globus_groups, g.get('uuid'))
    ]

    # If user belongs to any internal hubmap groups, they are an internal user
    is_internal_user = len(user_internal_hubmap_groups) > 0

    user_permission_groups = [
        k
        for k, group_id in permission_groups.items()
        if has_globus_group(user_globus_groups, group_id)
    ]

    return is_internal_user, user_permission_groups, user_internal_hubmap_groups


def extract_safe_redirect_path(url_before_login):
    """
    Extract and validate a safe redirect path from a URL.
    Handles both full URLs and relative paths by extracting only the path component.

    Args:
        url_before_login: URL-encoded string from cookie

    Returns:
        str: Safe path to redirect to, or '/' if invalid

    >>> extract_safe_redirect_path('http%3A%2F%2Flocalhost%3A5001%2Fbrowse%2Fdatasets')
    '/browse/datasets'
    >>> extract_safe_redirect_path('/browse/datasets')
    '/browse/datasets'
    >>> extract_safe_redirect_path('/search?q=test')
    '/search?q=test'
    >>> extract_safe_redirect_path('/page#section')
    '/page#section'
    >>> extract_safe_redirect_path('//evil.com/path')
    '/'
    >>> extract_safe_redirect_path('/..%2f..%2fetc%2fpasswd')
    '/'
    >>> extract_safe_redirect_path('')
    '/'
    >>> extract_safe_redirect_path('http://external.com/malicious')
    '/malicious'
    """
    if not url_before_login:
        return '/'

    decoded_url = unquote(url_before_login)

    # Check for protocol-relative URLs (//domain/path) before parsing
    if decoded_url.startswith('//'):
        return '/'

    parsed = urlparse(decoded_url)

    # Extract path, query, and fragment from the URL
    safe_path = parsed.path if decoded_url else '/'
    if parsed.query:
        safe_path += '?' + parsed.query
    if parsed.fragment:
        safe_path += '#' + parsed.fragment

    # Validate the path is safe: must be a relative path starting with '/' and not contain path traversal
    is_safe = (
        safe_path
        and safe_path.startswith('/')
        and (' ' not in safe_path)
        and '\\' not in safe_path
        and not any(
            safe_path.startswith(prefix)
            for prefix in ['/\\', '/..', '/../', '/./', '/%2e', '/%2f', '/%5c']
        )
    )

    return safe_path if is_safe else '/'


def format_user_groups_cookie_value(user_globus_groups):
    """
    Format user's Globus groups into a pipe-delimited string for cookie storage.

    Args:
        user_globus_groups: List of user's Globus group dicts

    Returns:
        str: Pipe-delimited group names or 'none' if no groups

    >>> groups = [{'name': 'Team A'}, {'name': 'Team B'}]
    >>> format_user_groups_cookie_value(groups)
    'Team A|Team B'
    >>> format_user_groups_cookie_value([])
    'none'
    >>> format_user_groups_cookie_value(None)
    'none'
    """
    if not user_globus_groups:
        return 'none'
    return '|'.join(g.get('name') for g in user_globus_groups)


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
    # The redirect URI, as a complete URI (not relative path)
    redirect_uri = url_for('routes_auth.login', _external=True)

    client = load_app_client()
    log('1/4: oauth2_start_flow')

    client.oauth2_start_flow(redirect_uri, GLOBUS_AUTH_SCOPE)

    # If there's no "code" query string parameter, we're in this route
    # starting a Globus Auth login flow; Redirect out to Globus Auth:
    if 'code' not in request.args:
        log('2: oauth2_get_authorize_url')
        auth_uri = client.oauth2_get_authorize_url(query_params={'scope': GLOBUS_AUTH_SCOPE})
        log('3: redirect auth_url')
        return redirect(auth_uri)

    # If we do have a "code" param, we're coming back from Globus Auth
    # and can start the process of exchanging an auth code for a token.
    code = request.args.get('code')
    log('5: oauth2_exchange_code_for_tokens')
    tokens = client.oauth2_exchange_code_for_tokens(code) if code else None

    # Extract tokens from Globus response
    groups_token, auth_token = extract_tokens_from_globus_response(tokens)

    # Fetch user info from Globus
    log('6: userinfo')
    user_info_request_headers = {'Authorization': 'Bearer ' + auth_token}
    user_info = requests.get(
        'https://auth.globus.org/v2/oauth2/userinfo', headers=user_info_request_headers
    ).json()

    # Extract user information
    user_data = extract_user_info_from_globus(user_info)
    user_globus_groups = get_globus_groups(groups_token)

    log('7: HuBMAP globus groups')
    # Auth Helper cache must be initialized before we can call getHuBMAPGroupInfo()
    if not AuthHelper.isInitialized():
        client_id = current_app.config['APP_CLIENT_ID']
        client_secret = current_app.config['APP_CLIENT_SECRET']
        AuthHelper.create(client_id, client_secret)
    else:
        AuthHelper.instance()

    globus_groups = AuthHelper.getHuBMAPGroupInfo().values()

    permission_groups = {
        'HuBMAP': current_app.config['GROUP_ID'],
        'Workspaces': current_app.config['WORKSPACES_GROUP_ID'],
    }

    workspaces_token = ''  # None would serialize to "None" ... which is no longer false-y.
    if 'HuBMAP' in permission_groups or 'Workspaces' in permission_groups:
        # This could be defered until someone actually tries to access the workspaces, but:
        # - This network request could potentially be slow... Lump it with the other slows.
        # - If you're logged in, you should be logged in all the way... Easier to debug.
        workspaces_post_url = current_app.config['WORKSPACES_ENDPOINT'] + '/tokens/'
        workspaces_post_data = dumps({'auth_token': groups_token})
        workspaces_post_resp = requests.post(workspaces_post_url, data=workspaces_post_data)

        try:
            workspaces_token = workspaces_post_resp.json()['token']
        except Exception as e:
            if not workspaces_post_resp.ok:
                current_app.logger.error(
                    'Workspaces auth failed: '
                    f'{workspaces_post_resp.status_code} {workspaces_post_resp.text[:100]}'
                )
            else:
                current_app.logger.error(f'Workspaces auth token read failed: {e}')

    # Determine user permissions and internal status
    is_internal_user, user_permission_groups, _ = determine_user_permissions(
        user_globus_groups, globus_groups, permission_groups
    )

    # Update session with user data
    session.update(
        groups_token=groups_token,
        is_authenticated=True,
        user_email=user_data['email'],
        workspaces_token=workspaces_token,
        user_groups=user_permission_groups,
        user_first_name=user_data['first_name'],
        user_last_name=user_data['last_name'],
        user_globus_id=user_data['id'],
        user_globus_affiliation=user_data['affiliation'],
    )

    # Extract safe redirect path from cookie
    url_before_login = request.cookies.get('urlBeforeLogin') or ''
    safe_path = extract_safe_redirect_path(url_before_login)
    response = make_response(redirect(safe_path))

    # Set cookies used in trackers.js:
    if is_internal_user:
        response.set_cookie(key='last_login', value=datetime.now().isoformat(), expires=2**31 - 1)
    else:
        # If the user is not internal, we don't want the last_login cookie to be set
        response.set_cookie(key='last_login', value='', expires=0)

    # Format and set user groups cookie
    user_groups_value = format_user_groups_cookie_value(user_globus_groups)
    response.set_cookie(key='user_groups', value=user_groups_value, expires=2**31 - 1)

    log('8: redirect to previous_url')
    return response


@blueprint.route('/logout')
def logout():
    """
    - Revoke the tokens with Globus Auth.
    - Destroy the session state.
    - And when redirect returns, redirect again to the Globus Auth logout page.
    """
    redirect_to_globus_param = 'redirect_to_globus'

    if redirect_to_globus_param in request.args:
        redirect_uri = url_for('routes_main.index', _external=True)
        globus_logout_url = 'https://auth.globus.org/v2/web/logout?' + urlencode(
            {
                'client': current_app.config['APP_CLIENT_ID'],
                'redirect_uri': redirect_uri,
                'redirect_name': 'HuBMAP Portal',
            }
        )
        return redirect(globus_logout_url)

    client = load_app_client()

    # Revoke the tokens with Globus Auth
    try:
        tokens = session['tokens']
    except Exception:
        # May have only hit this because of weird state during development,
        # but if there are no tokens, there's nothing to revoke.
        tokens = {}
    for token in (token_info['access_token'] for token_info in tokens.values()):
        client.oauth2_revoke_token(token)

    # Destroy the session state
    session.clear()

    response = make_response(
        redirect(url_for('routes_auth.logout', _external=True, redirect_to_globus=True))
    )
    # Reset cookies used in trackers.js:
    response.set_cookie(key='last_login', value='', max_age=0)
    response.set_cookie(key='user_groups', value='none', max_age=0)
    return response
