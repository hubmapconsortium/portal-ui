#!/usr/bin/env bash
set -o errexit

die() { set +v; echo "$*" 1>&2 ; exit 1; }

[ "$#" -eq 2 ] || die "usage: $0 USERNAME [dev | test]"
USER="$1"
TARGET="$2"

# heredoc will be interpolated: Escape backticks and variables defined inside the block.
ssh "$USER@ingest.$TARGET.hubmapconsortium.org" << EOF
echo 'whoami?' \`whoami\`
sudo -i
echo 'whoami?' \`whoami\`
su - hive
echo 'whoami?' \`whoami\`

cd /opt/hubmap/portal-ui/compose
echo 'portal running?' \`docker ps | grep portal-ui\`

COMPOSE_CONFIG=hubmap.yml
[ "$TARGET" = "test" ] && COMPOSE_CONFIG=hubmap.test.yml
# hubmap.test.yml includes two portal instances.

echo 'stopping...'
docker-compose -f \$COMPOSE_CONFIG down
echo 'portal running?' \`docker ps | grep portal-ui\`

echo 'removing old "latest"...'
# Unless we clear it, Docker will think it already has the image.
docker rmi hubmap/portal-ui:latest

echo 'starting...'
docker-compose -f \$COMPOSE_CONFIG up -d

# We don't understand why the prod-test instance is getting the wrong configuration.
# We hope turning it off-and-on will help, but this is not a good situation.
if [ "$TARGET" = "test" ]; then
    echo 'Restart the hubmap-auth container... for STAGE only'
    docker restart hubmap-auth
fi

echo 'portal running?' \`docker ps | grep portal-ui\`

docker exec -it portal-ui cat package.json

EOF

echo "Visit --> http://portal.$TARGET.hubmapconsortium.org/"

[ "$TARGET" = "test" ] && echo "Visit --> http://portal-prod.test.hubmapconsortium.org/"
