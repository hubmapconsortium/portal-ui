#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt > /dev/null
export FLASK_APP=portal
export FLASK_ENV=development

# In production, the redirect after login should be https;
# not required during development.
export OAUTHLIB_INSECURE_TRANSPORT=1

# These are only for development:
export GLOBUS_CLIENT_ID='12518f0d-4594-4632-8c4c-a6839024d238',
export GLOBUS_CLIENT_SECRET='gEfGGE09nMMjwZxWafL+2/M3UqcGl9czSL72H+O1xuU=',
export GLOBUS_REDIRECT='/auth/complete/globus/'

# Port is required because our test account with Globus
# expects the redirect after login to be port 8000.
flask run --port 8000
