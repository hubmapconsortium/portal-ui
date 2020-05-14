#!/usr/bin/env bash
set -o errexit

die() { set +v; echo "$*" 1>&2 ; exit 1; }

[ "$#" -eq 2 ] || die "usage: $0 USERNAME [ dev | test ]"
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
docker-compose -f hubmap.yml down
echo 'portal running?' `docker ps | grep portal-ui`

echo 'removing old "latest"...'
# Unless we clear it, Docker will think it already has the image.
docker rmi hubmap/portal-ui:latest

echo 'starting...'
docker-compose -f hubmap.yml up -d
echo 'portal running?' `docker ps | grep portal-ui`

# TODO: Move VERSION into context, and cat it.
docker exec -it portal-ui cat package.json

EOF

echo "Visit --> http://portal.$TARGET.hubmapconsortium.org/"
