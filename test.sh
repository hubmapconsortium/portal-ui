#!/usr/bin/env bash
set -o errexit

start() { echo travis_fold':'start:$1; echo $1; }
end() { echo travis_fold':'end:$1; }
die() { set +v; echo "$*" 1>&2 ; sleep 1; exit 1; }

start quick-start
./quick-start.sh &
PID=$!
TRIES=0
MAX_TRIES=5
until curl --silent --fail http://localhost:8000; do
  [ ${TRIES} -gt ${MAX_TRIES} ] && die 'Server did not come up'
  printf '.'
  sleep 1
  TRIES=$(($TRIES+1))
done
kill -9 $PID # Unit tests should not depend on running server.
echo 'Server starts up, and homepage returns 200.'
end quick-start

start flake8
# Unit tests require dev dependencies beyond what quick-start provides.
pip install -r requirements-dev.txt > /dev/null
flake8
end flake8

start pytest
pytest -vv
end pytest

start changelog
diff CHANGELOG.md <(curl https://raw.githubusercontent.com/hubmapconsortium/portal-ui/master/CHANGELOG.md) \
  && die 'Update CHANGELOG.md'
end changelog
