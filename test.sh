#!/usr/bin/env bash
set -o errexit

start() { echo travis_fold':'start:$1; echo $1; }
end() { echo travis_fold':'end:$1; }
die() { set +v; echo "$*" 1>&2 ; sleep 1; exit 1; }

server_up() {
  TRIES=0
  MAX_TRIES=60
  URL=http://localhost:$1
  until curl --silent --fail $URL; do
    [ ${TRIES} -gt ${MAX_TRIES} ] && die "Server not running at $URL"
    printf '.'
    sleep 1
    TRIES=$(($TRIES+1))
  done
  echo "Server starts up, and $URL returns 200."
}

start quick-start
if [ ! -z "$TRAVIS" ]; then
  ./quick-start.sh || sed -i 's/TODO/FAKE/' context/instance/app.conf
fi
./quick-start.sh &
server_up 5000
end quick-start

start flake8
# Unit tests require dev dependencies beyond what quick-start provides.
pip install -r context/requirements-dev.txt > /dev/null
EXCLUDE=node_modules,ingest-validation-tools,search-schema
flake8 --exclude=$EXCLUDE \
  || die "Try: autopep8 --in-place --aggressive -r . --exclude $EXCLUDE"
end flake8

start pytest
pytest -vv
end pytest

start docker
./docker.sh 5001
server_up 5001
npm run cypress:run
end docker

start changelog
if [ "$TRAVIS_BRANCH" != 'master' ]; then
  diff CHANGELOG.md <(curl https://raw.githubusercontent.com/hubmapconsortium/portal-ui/master/CHANGELOG.md) \
    && die 'Update CHANGELOG.md'
fi
end changelog
