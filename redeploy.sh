#!/usr/bin/env bash
set -o errexit

die() { set +v; echo "$*" 1>&2 ; exit 1; }

[ "$#" -eq 2 ] || die "usage: $0 USERNAME [ dev | test | stage]"
USER="$1"
TARGET="$2"

ssh "$USER@ingest.$TARGET.hubmapconsortium.org" << 'EOF'
echo 'whoami?' `whoami`
sudo -i
echo 'whoami?' `whoami`
su - centos
echo 'whoami?' `whoami`

cd /home/centos/hubmap/portal-ui/compose
echo 'portal running?' `docker ps | grep portal-ui`

echo 'stopping...'

# Also stop and remove the portal-ui-pord container on STAGE only
if [ "$2" = "stage" ]; then
    docker-compose -f hubmap.yml -f portal-prod.stage.yml down
else
    docker-compose -f hubmap.yml down
fi

echo 'portal running?' `docker ps | grep portal-ui`

echo 'removing old "latest"...'
# Unless we clear it, Docker will think it already has the image.
docker rmi hubmap/portal-ui:latest

echo 'starting...'

# Also start the portal-ui-pord container on STAGE only
if [ "$2" = "stage" ]; then
    docker-compose -f hubmap.yml -f portal-prod.stage.yml up -d
else
    docker-compose -f hubmap.yml up -d
fi

echo 'portal running?' `docker ps | grep portal-ui`

# TODO: Move VERSION into context, and cat it.
docker exec -it portal-ui cat package.json

EOF

echo "Visit --> http://portal.$TARGET.hubmapconsortium.org/"

if [ "$2" = "stage" ]; then
    echo "Visit --> http://portal-prod.$TARGET.hubmapconsortium.org/"
fi

