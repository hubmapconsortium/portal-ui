#!/usr/bin/env bash
set -o errexit

CONTEXT=context
pip install -r $CONTEXT/requirements.txt > /dev/null

[ -d $CONTEXT/instance ] || \
  mkdir $CONTEXT/instance; cp example-app.conf $CONTEXT/instance/app.conf; \
  echo 'You will need to update app.conf in order to login with Globus.'

FLASK_ENV=development FLASK_APP=$CONTEXT/app/main.py python -m flask run
