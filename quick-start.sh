#!/usr/bin/env bash
set -o errexit

die() { set +v; echo "$*" 1>&2 ; exit 1; }

CONTEXT=context
pip install -r $CONTEXT/requirements.txt > /dev/null

cd context/app/schemas
REPO=https://raw.githubusercontent.com/hubmapconsortium/search-schema
wget -N $REPO/master/data/schemas/{dataset,donor,sample}.schema.yaml
# -N Clobbers the old version.
cd -
git diff --quiet || die "Commit latest schema versions."

APP_INSTANCE="$CONTEXT/instance"
APP_CONF="$APP_INSTANCE/app.conf"

if [ ! -e $APP_CONF ]; then
  mkdir -p "$APP_INSTANCE"
  cp example-app.conf "$APP_CONF"
else
  echo "Using existing $APP_CONF."
fi

grep 'TODO' "$APP_CONF" && die "Replace 'TODO' in $APP_CONF."

cd $CONTEXT && npm install && npm run dev-build && cd ../

FLASK_ENV=development FLASK_APP="$CONTEXT/app/main.py" python -m flask run
