#!/usr/bin/env bash
set -o errexit
trap 'jobs -p | xargs kill' EXIT

die() { set +v; echo "$*" 1>&2 ; exit 1; }

# Check language versions

INSTALLED_PYTHON_V=$(python --version | sed -e 's/.* /v/')
REQUIRED_PYTHON_V='v'$(cat .python-version)

[[ "$INSTALLED_PYTHON_V" = "$REQUIRED_PYTHON_V" ]] \
  || die "Installed python version ($INSTALLED_PYTHON_V) != required version ($REQUIRED_PYTHON_V) "

INSTALLED_NODE_V=$(node --version)
REQUIRED_NODE_V=$(cat .nvmrc)

[[ "$INSTALLED_NODE_V" = "$REQUIRED_NODE_V" ]] \
  || die "Installed node version ($INSTALLED_NODE_V) != required version ($REQUIRED_NODE_V) " 

# Install

git submodule init
git submodule update
git config submodule.recurse true # So 'git pull' will update submodules.

CONTEXT=context
pip install -r $CONTEXT/requirements.txt > /dev/null

etc/dev/copy-app-conf.sh

cd $CONTEXT
npm install

# Start subprocesses

FLASK_ENV=development FLASK_APP="app/main.py" python -m flask run &

npm run lint || die 'Try "npm run lint:fix"'
npm run dev-server &
npm run storybook &

wait
