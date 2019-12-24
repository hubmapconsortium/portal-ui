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


def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(default_config.DefaultConfig)
    app.config.from_pyfile('app.conf')

    app.register_blueprint(routes_main.blueprint)
    app.register_blueprint(routes_auth.blueprint)
    app.register_blueprint(routes_markdown.blueprint)

    app.register_error_handler(400, bad_request)
    app.register_error_handler(404, not_found)
    app.register_error_handler(403, access_denied)

    @app.context_processor
    def inject_template_globals():
        return {
            'is_authenticated': session.get('is_authenticated')
        }

    return app


app = create_app()
