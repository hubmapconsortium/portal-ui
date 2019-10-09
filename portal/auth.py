from flask import url_for, redirect
from authlib.flask.client import OAuth

# A Blueprint doesn't quite work here:
# oauth needs to access app.config, which isn't available.


def add_auth(app):
    oauth = OAuth(app)
    oauth.register(
        'globus',
        authorize_url='https://auth.globus.org/v2/oauth2/authorize',
        client_id='12518f0d-4594-4632-8c4c-a6839024d238',
        client_secret='gEfGGE09nMMjwZxWafL+2/M3UqcGl9czSL72H+O1xuU=',
        state='placeholder'
    )

    @app.route('/auth/login')
    def login():
        redirect_uri = url_for('complete', _external=True)
        return oauth.globus.authorize_redirect(redirect_uri)

    # Redirect URL is registered with Globus:
    # Hostname and path are required to exactly match their records,
    # so we can't change this without re-registering.
    @app.route('/auth/complete/globus/')
    def complete():
        # token = oauth.globus.authorize_access_token()
        # resp = oauth.globus.get('user')
        # profile = resp.json()
        # do something with the token and profile
        return redirect('/')
