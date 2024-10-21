#!/usr/bin/env bash
set -o errexit

. etc/test/utils.sh

copy_conf

CYPRESS_ARGS=''
PORT=8000

start cypress

CYPRESS_ARGS='--spec ./cypress/e2e/portal/*.cy.js'
etc/dev/docker.sh 5001  # Needs to match port in cypress.json.
server_up 5001  # Without this, Cypress gets an undefined content-type and immediately fails.


end-to-end/test.sh $CYPRESS_ARGS
docker kill hubmap-portal-ui || true #Kills docker container if it is running, but does not error if the container is not.

end cypress

