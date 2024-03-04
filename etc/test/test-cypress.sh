#!/usr/bin/env bash
set -o errexit

. etc/test/utils.sh

copy_conf

CYPRESS_ARGS=''
PORT=8000

start cypress

case $1 in

  maintenance)
    CYPRESS_ARGS="--spec cypress/e2e/maintenance/*.cy.js --config baseUrl=http://localhost:${PORT}"
    cd context
    npm run build:maintain
    ( cd app/static/js/maintenance/public/ ; python -m http.server $PORT & )
    cd -
    ;;

  portal)
    CYPRESS_ARGS='--spec ./cypress/e2e/portal/*.cy.js'
    etc/dev/docker.sh 5001  # Needs to match port in cypress.json.
    server_up 5001  # Without this, Cypress gets an undefined content-type and immediately fails.
    ;;

  *)
    die "Unexpected argument: $1"
    ;;
esac

end-to-end/test.sh $CYPRESS_ARGS
docker kill hubmap-portal-ui || true #Kills docker container if it is running, but does not error if the container is not.

end cypress

