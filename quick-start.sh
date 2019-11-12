#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt > /dev/null

mkdir instance
echo 'You will need to update app.conf in order to login with Globus.'
cp example-app.conf instance/app.conf

FLASK_ENV=development ./app.py
