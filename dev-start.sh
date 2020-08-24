#!/usr/bin/env bash
set -o errexit
trap 'jobs -p | xargs kill' EXIT

die() { set +v; echo "$*" 1>&2 ; exit 1; }

[ "`git config --get submodule.recurse`" == 'true' ] \
  || die "To update submodules automatically: git config --global submodule.recurse true";

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

FLASK_ENV=development FLASK_APP="$CONTEXT/app/main.py" python -m flask run &
cd $CONTEXT
npm install
npm run lint || die 'Try "npm run lint:fix"'
npm run dev-server &

wait