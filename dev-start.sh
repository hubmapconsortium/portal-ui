#!/usr/bin/env bash
set -o errexit
trap 'jobs -p | xargs kill' EXIT

die() { set +v; echo "$*" 1>&2 ; exit 1; }

git submodule init
git submodule update
git config submodule.recurse true # So 'git pull' will update submodules.

CONTEXT=context
pip install -r $CONTEXT/requirements.txt > /dev/null
# TODO: Make portal-visualization a package and just use pip's dependency resolution.
pip install -r $CONTEXT/portal-visualization/requirements.txt > /dev/null

./copy-app-conf.sh

cd $CONTEXT
FLASK_ENV=development FLASK_APP="app/main.py" python -m flask run &
npm install
npm run lint || die 'Try "npm run lint:fix"'
npm run dev-server &
npm run storybook &

wait
