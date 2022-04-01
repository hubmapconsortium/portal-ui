#!/usr/bin/env bash
set -o errexit

. utils.sh

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

cd context

./copy-app-conf.sh || (
  echo 'app.conf before:'
  cat context/instance/app.conf
  echo 'Rewrite conf...'
  sed -i 's/TODO/FAKE/' context/instance/app.conf
  echo 'app.conf after:'
  cat context/instance/app.conf
)

start cypress

npm run build:maintain
( cd app/static/js/maintenance/public/ ; python -m http.server 8000 & )

cd -
./docker.sh 5001  # Needs to match port in cypress.json.
server_up 5001  # Without this, Cypress gets an undefined content-type and immediately fails.
end-to-end/test.sh
docker kill hubmap-portal-ui

end cypress


