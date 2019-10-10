from flask import Flask

from . import routes, auth


def create_app(test_config=None):
    # Create and configure the app:
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
    )

    if test_config is None:
        # Load the instance config, if it exists, when not testing:
        app.config.from_pyfile('config.py', silent=True)
    else:
        # Load the test config if passed in:
        app.config.from_mapping(test_config)

    app.register_blueprint(routes.blueprint)
    auth.add_auth(app)

    return app
