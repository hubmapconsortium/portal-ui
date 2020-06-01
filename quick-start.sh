#!/usr/bin/env bash
set -o errexit
trap "kill 0" EXIT

die() { set +v; echo "$*" 1>&2 ; exit 1; }

CONTEXT=context
pip install -r $CONTEXT/requirements.txt > /dev/null

APP_INSTANCE="$CONTEXT/instance"
APP_CONF="$APP_INSTANCE/app.conf"

if [ ! -e $APP_CONF ]; then
  mkdir -p "$APP_INSTANCE"
  cp example-app.conf "$APP_CONF"
else
  echo "Using existing $APP_CONF."
fi

grep 'TODO' "$APP_CONF" && die "Replace 'TODO' in $APP_CONF."

cd $CONTEXT && npm install && cd -

FLASK_ENV=development FLASK_APP="$CONTEXT/app/main.py" python -m flask run &
cd context && npm run dev-server &

wait
