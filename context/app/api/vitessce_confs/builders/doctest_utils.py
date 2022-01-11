from flask import Flask


def app_context():
    app = Flask('doctests')
    app.config['ASSETS_ENDPOINT'] = 'https://example.com'
    return app.app_context()
