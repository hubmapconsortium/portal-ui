#!/usr/bin/env bash
set -o errexit

start() { echo travis_fold':'start:$1; echo $1; }
end() { echo travis_fold':'end:$1; }
die() { set +v; echo "$*" 1>&2 ; sleep 1; exit 1; }

server_up() {
  TRIES=0
  MAX_TRIES=250
  URL=http://localhost:$1
  until curl --silent --fail $URL; do
    [ ${TRIES} -gt ${MAX_TRIES} ] && die "Server not running at $URL"
    printf '.'
    sleep 2
    TRIES=$(($TRIES+1))
  done
  echo "Server starts up, and $URL returns 200."
}


start changelog
if [ "$GH_ACTIONS_BRANCH" != 'refs/heads/master' ] && [ "$TRAVIS_BRANCH" != 'master' ]; then
  git remote set-branches --add origin master
  git fetch
  # "--stat=1000" ensures that filenames are not truncated. 
  git diff --stat=1000 --compact-summary origin/master \
    | grep -e '^ CHANGELOG-\S\+ (new)' \
    || die 'Add a CHANGELOG-something.md at the top level'
fi
end changelog


start flake8
# Unit tests require dev dependencies beyond requirements.txt.
pip install -r context/requirements-dev.txt > /dev/null
EXCLUDE=node_modules,ingest-validation-tools
flake8 --exclude=$EXCLUDE \
  || die "Try: autopep8 --in-place --aggressive -r . --exclude $EXCLUDE"
end flake8


start pytest
pytest context/app
end pytest


start npm-test
cd context
npm run test
cd -
end npm-test


start docker
./docker.sh 5001  # Needs to match port in cypress.json.
server_up 5001  # Without this, Cypress gets an undefined content-type and immediately fails.
end-to-end/test.sh
docker kill hubmap-portal-ui
end docker
