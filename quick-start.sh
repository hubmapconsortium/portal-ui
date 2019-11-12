#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt > /dev/null

[ -d instance ] || \
  mkdir instance; cp example-app.conf instance/app.conf; \
  echo 'You will need to update app.conf in order to login with Globus.'

FLASK_ENV=development ./app.py
