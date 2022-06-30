#!/usr/bin/env bash
set -o errexit

. utils.sh

copy_conf

CYPRESS_ARGS=''

start cypress

case $1 in

  maintenance)
    PORT=8000
    CYPRESS_ARGS="--spec ./cypress/integration/maintenance/*.spec.js --config baseUrl=http://localhost:${PORT}"
    ./build-maintenance-for-cypress.sh $PORT
    ;;

  portal)
    CYPRESS_ARGS='--spec ./cypress/integration/portal/*.spec.js'
    ./docker.sh 5001  # Needs to match port in cypress.json.
    server_up 5001  # Without this, Cypress gets an undefined content-type and immediately fails.
    ;;

  *)
    ./build-maintenance-for-cypress.sh
    ./docker.sh 5001
    server_up 5001
    ;;
esac

end-to-end/test.sh $CYPRESS_ARGS
docker kill hubmap-portal-ui || true #Kills docker container if it is running, but does not error if the container is not.

end cypress

