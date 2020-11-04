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

set -o errexit

function take_it_down {
  [ -e /home/centos/hubmap/$1 ] || return
  cd /home/centos/hubmap/$1/compose
  echo "$1 running?" `docker ps | grep $1`

  echo "stopping $1..."
  docker-compose -f hubmap.yml down
  echo "$1 running?" `docker ps | grep $1`
}

function bring_it_up {
  [ -e /home/centos/hubmap/$1 ] || return
  cd /home/centos/hubmap/$1/compose
  echo "starting $1..."
  docker-compose -f hubmap.yml up -d
  echo "$1 running?" `docker ps | grep portal-ui`
}

take_it_down "portal-ui"
take_it_down "portal-ui-prod"

echo 'removing old "latest"...'
# Unless we clear it, Docker will think it already has the image.
docker rmi hubmap/portal-ui:latest || echo 'Image already gone'

bring_it_up "portal-ui"
bring_it_up "portal-ui-prod"

EOF

echo "Visit --> http://portal.$TARGET.hubmapconsortium.org/"
