#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt > /dev/null

[ -d app/instance ] || \
  mkdir app/instance; cp example-app.conf app/instance/app.conf; \
  echo 'You will need to update app.conf in order to login with Globus.'

FLASK_ENV=development FLASK_APP=app/app/main.py python -m flask run
