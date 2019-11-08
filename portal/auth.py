from os import environ
import json

from flask import url_for, flash, redirect
from authlib.flask.client import OAuth

# A Blueprint doesn't quite work here:
# oauth needs to access app.config, which isn't yet available.


def add_auth(app):
    oauth = OAuth(app)
    oauth.register(
        'globus',
        authorize_url='https://auth.globus.org/v2/oauth2/authorize',
        client_id=environ['GLOBUS_CLIENT_ID'],
        client_secret=environ['GLOBUS_CLIENT_SECRET'],
        state='placeholder'
    )

    @app.route('/auth/login')
    def login():
        redirect_uri = url_for('complete', _external=True)
        return oauth.globus.authorize_redirect(redirect_uri)

    # Redirect URL is registered with Globus:
    # Hostname and path are required to exactly match what is on record.
    @app.route(environ['GLOBUS_REDIRECT'])
    def complete():
        token = oauth.globus.authorize_access_token()
        resp = oauth.globus.get('user')
        profile = resp.json()
        # do something with the token and profile
        flash('You were successfully logged in!' + json.dumps(profile))
        return redirect('/')
