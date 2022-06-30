#!/usr/bin/env bash
set -o errexit

PORT=$1

cd context
 npm run build:maintain
cd app/static/js/maintenance/public/
python -m http.server $PORT &
