from flask import Flask, session, render_template

from . import routes_main, routes_auth, routes_markdown, default_config


def bad_request(e):
    '''A 400 means the request to the API failed.'''
    return render_template('errors/400.html', types={}), 400


def not_found(e):
    '''A 404 means Flask routing failed.'''
    return render_template('errors/404.html', types={}), 404


def access_denied(e):
    '''A 403 probably means Globus login is required.'''
    return render_template('errors/403.html', types={}), 403


def unauthorized(e):
    '''A 401 means Globus credentials have expired, or they were never granted.'''
    if 'nexus_token' not in session:
        abort(403)
    # Mostly copy-and-paste from https://github.com/hubmapconsortium/commons/blob/dc69f4/hubmap_commons/hm_auth.py#L347-L355
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + session['nexus_token']
    }
    params = {
        'fields': 'id,name,description',
        # I'm not sure what these do, and if they are necessary:
        'for_all_identities': 'false',
        'my_statuses': 'active'
    }
    response = requests.get('https://nexus.api.globusonline.org/groups', headers=headers, params=params)
    if response.status_code != 200:
        abort(500)
    groups = response.json()
    has_read_privs = any([group['name'] == 'HuBMAP-read' for group in groups])
    if has_read_privs:
        return render_template('errors/401-expired-cred.html', types={}), 401
    return render_template('errors/401-no-cred.html', types={}), 401


def gateway_timeout(e):
    '''A 504 means the API has timed out.'''
    return render_template('errors/504.html', types={}), 504


def create_app(testing=False):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(default_config.DefaultConfig)
    if testing:
        app.config['TESTING'] = True
    else:
        # We should not load the gitignored app.conf during tests.
        app.config.from_pyfile('app.conf')

    app.register_blueprint(routes_main.blueprint)
    app.register_blueprint(routes_auth.blueprint)
    app.register_blueprint(routes_markdown.blueprint)

    app.register_error_handler(400, bad_request)
    app.register_error_handler(401, unauthorized)
    app.register_error_handler(404, not_found)
    app.register_error_handler(403, access_denied)
    app.register_error_handler(504, gateway_timeout)

    @app.context_processor
    def inject_template_globals():
        return {
            'is_authenticated': session.get('is_authenticated')
        }

    return app


app = create_app()
