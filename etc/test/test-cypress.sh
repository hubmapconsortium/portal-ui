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
    pnpm --filter ./context run build:maintain
    ( cd context/app/static/js/maintenance/public/ ; python -m http.server $PORT & )
    ;;

  portal)
    CYPRESS_ARGS='--spec cypress/e2e/portal/**/*.cy.js'
    # API_ENV picks the backend: append its endpoints to a copy of app.conf (later assignments win).
    export CYPRESS_API_ENV=${API_ENV:-test}
    case $CYPRESS_API_ENV in
      test) ENDPOINTS=$(grep -E "^[A-Z_]+ *= *'https://" example-app.conf) ;;
      prod) ENDPOINTS=$(cat etc/test/prod-endpoints.conf) ;;
      *) die "Unexpected API_ENV: $CYPRESS_API_ENV" ;;
    esac
    export CONF_PATH=context/instance/app.cypress.conf
    printf '%s\n\n%s\n' "$(cat context/instance/app.conf)" "$ENDPOINTS" > $CONF_PATH
    etc/dev/docker.sh 5001  # Needs to match port in cypress.config.js.
    server_up 5001  # Without this, Cypress gets an undefined content-type and immediately fails.
    ;;

  *)
    die "Unexpected argument: $1"
    ;;
esac

# Electron is deprecated as a test browser since Cypress 16; Chrome also intercepts natively.
end-to-end/test.sh $CYPRESS_ARGS --browser "${CYPRESS_BROWSER:-chrome}"
docker kill hubmap-portal-ui || true #Kills docker container if it is running, but does not error if the container is not.

end cypress

