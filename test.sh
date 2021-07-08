#!/usr/bin/env bash
set -o errexit

start() { echo "::group::$1"; }
end() { echo "::endgroup::"; }
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
echo "GITHUB_REF: $GITHUB_REF"
echo "GITHUB_HEAD_REF: $GITHUB_HEAD_REF"
echo "GITHUB_BASE_REF: $GITHUB_BASE_REF"
if [ "$GITHUB_REF" != 'refs/heads/master' ] \
   && [[ "$GITHUB_REF" != *'dependabot'* ]] \
   && [[ "$GITHUB_HEAD_REF" != *'dependabot'* ]] \
   && [ ! -z "$GITHUB_HEAD_REF" ] \
   && [ ! -z "$GITHUB_BASE_REF" ]; then
  git remote set-branches --add origin master
  git fetch
  # "--stat=1000" ensures that filenames are not truncated. 
  git diff --stat=1000 --compact-summary origin/master \
    | grep -e '^ CHANGELOG-\S\+ (new)' \
    || die 'Add a CHANGELOG-something.md at the top level'
fi
end changelog


start copy-app-conf
if [ ! -z "$TRAVIS" ] || [ ! -z "$GH_ACTIONS" ]; then
  echo 'Running on ci...'
  ./copy-app-conf.sh || (
    echo 'app.conf before:'
    cat context/instance/app.conf
    echo 'Rewrite conf...'
    sed -i 's/TODO/FAKE/' context/instance/app.conf
    echo 'app.conf after:'
    cat context/instance/app.conf
  )
fi
end copy-app-conf


start flake8
EXCLUDE=node_modules,ingest-validation-tools
flake8 --exclude=$EXCLUDE \
  || die "Try: autopep8 --in-place --aggressive -r . --exclude $EXCLUDE"
end flake8


start pytest
pytest context/app
end pytest

cd context

start lint
npm run lint
end lint

start npm-test
npm run test
end npm-test

cd -

start docker
./docker.sh 5001  # Needs to match port in cypress.json.
server_up 5001  # Without this, Cypress gets an undefined content-type and immediately fails.
end-to-end/test.sh
docker kill hubmap-portal-ui
end docker
