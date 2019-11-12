from flask import Flask
import globus_sdk

from . import routes


def create_app(test_config=None):
    # Create and configure the app:
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_pyfile('app.conf')

    app.register_blueprint(routes.blueprint)

    return app
