#!/usr/bin/env bash
set -o errexit

. utils.sh

copy_conf

cd context

start cypress

npm run build:maintain
( cd app/static/js/maintenance/public/ ; python -m http.server 8000 & )

cd -
./docker.sh 5001  # Needs to match port in cypress.json.
server_up 5001  # Without this, Cypress gets an undefined content-type and immediately fails.
end-to-end/test.sh
docker kill hubmap-portal-ui

end cypress


