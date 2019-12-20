from flask import Flask, session, render_template

from . import routes_main, routes_auth, routes_markdown

def not_found(e):
    return render_template('errors/404.html', types={}), 404


def access_denied(e):
    return render_template('errors/403.html', types={}), 403


def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_pyfile('app.conf')

    app.register_blueprint(routes_main.blueprint)
    app.register_blueprint(routes_auth.blueprint)
    app.register_blueprint(routes_markdown.blueprint)

    app.register_error_handler(404, not_found)
    app.register_error_handler(403, access_denied)

    @app.context_processor
    def inject_template_globals():
        return {
            'is_authenticated': session.get('is_authenticated')
        }

    return app


app = create_app()
