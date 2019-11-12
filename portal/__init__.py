from flask import Flask, session

from . import routes, routes_auth


def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_pyfile('app.conf')
    app.register_blueprint(routes.blueprint)
    app.register_blueprint(routes_auth.blueprint)

    @app.context_processor
    def inject_template_globals():
        return {
            'is_authenticated': session.get('is_authenticated')
        }

    return app
