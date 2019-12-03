#!/usr/bin/env bash
set -o errexit

start() { echo travis_fold':'start:$1; echo $1; }
end() { echo travis_fold':'end:$1; }
die() { set +v; echo "$*" 1>&2 ; sleep 1; exit 1; }

start quick-start
if [ ! -z "$TRAVIS" ]; then
  ./quick-start.sh || sed -i 's/TODO/FAKE/' context/instance/app.conf
  ./quick-start.sh &
fi
TRIES=0
MAX_TRIES=5
until curl --silent --fail http://localhost:5000; do
  [ ${TRIES} -gt ${MAX_TRIES} ] && die 'Server did not come up'
  printf '.'
  sleep 1
  TRIES=$(($TRIES+1))
done
echo 'Server starts up, and homepage returns 200.'
end quick-start

start flake8
# Unit tests require dev dependencies beyond what quick-start provides.
pip install -r context/requirements-dev.txt > /dev/null
flake8 || die 'Try "autopep8 --in-place --aggressive -r ."'
end flake8

start pytest
pytest -vv
end pytest

start docker
./docker.sh 5001
end docker

start changelog
diff CHANGELOG.md <(curl https://raw.githubusercontent.com/hubmapconsortium/portal-ui/master/CHANGELOG.md) \
  && die 'Update CHANGELOG.md'
end changelog
