#!/usr/bin/env bash

# Only designed to be called from the base Docker image on startup:
# https://github.com/tiangolo/uwsgi-nginx-flask-docker#custom-appprestartsh

echo 'app.conf:'
cat /app/instance/app.conf
echo '---------'