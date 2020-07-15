#!/usr/bin/env bash
set -o errexit

start() { echo travis_fold':'start:$1; echo $1; }
end() { echo travis_fold':'end:$1; }
die() { set +v; echo "$*" 1>&2 ; sleep 1; exit 1; }

start changelog
if [ "$TRAVIS_BRANCH" != 'master' ] && [[ "$TRAVIS_BRANCH" != *'release'* ]]; then
  git remote set-branches --add origin master
  git fetch
  git diff --summary origin/master \
    | grep '^ create' | grep 'CHANGELOG-' \
    || die 'Add a CHANGELOG-something.md'
fi
end changelog

start dev-start
if [ ! -z "$TRAVIS" ]; then
  echo 'Running on Travis...'
  ./dev-start.sh || (
    echo 'app.conf before:'
    cat context/instance/app.conf
    echo 'Rewrite conf...'
    sed -i 's/TODO/FAKE/' context/instance/app.conf
    echo 'app.conf after:'
    cat context/instance/app.conf
  )
fi
./dev-start.sh &
cypress-etc/test.sh
kill $!  # Kill dev server
end dev-start

start flake8
# Unit tests require dev dependencies beyond requirements.txt.
pip install -r context/requirements-dev.txt > /dev/null
EXCLUDE=node_modules,ingest-validation-tools
flake8 --exclude=$EXCLUDE \
  || die "Try: autopep8 --in-place --aggressive -r . --exclude $EXCLUDE"
end flake8

start pytest
pytest
end pytest

start docker
./docker.sh 5001  # Needs to match port in cypress.json.
cypress-etc/test.sh
end docker
