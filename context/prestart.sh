#!/usr/bin/env bash

# Only designed to be called from the base Docker image on startup:
# https://github.com/tiangolo/uwsgi-nginx-flask-docker#custom-appprestartsh

echo 'app.conf:'
grep -v '^#' /app/instance/app.conf | grep 'ENDPOINT'
echo '---------'