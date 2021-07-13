#!/usr/bin/env bash
set -o errexit
trap 'jobs -p | xargs kill' EXIT

die() { set +v; echo "$*" 1>&2 ; exit 1; }

[ "`git config --get submodule.recurse`" == 'true' ] \
  || die "To update submodules automatically: git config --global submodule.recurse true";

CONTEXT=context
pip install -r $CONTEXT/requirements.txt > /dev/null

./copy-app-conf.sh

FLASK_ENV=development FLASK_APP="$CONTEXT/app/main.py" python -m flask run &
cd $CONTEXT
npm install
npm run lint || die 'Try "npm run lint:fix"'
npm run dev-server &
npm run storybook &

wait
