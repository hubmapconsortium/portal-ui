#!/usr/bin/env bash
set -o errexit

die() { set +v; echo "$*" 1>&2 ; exit 1; }

IMAGE_NAME=hubmap/portal-ui
CONTAINER_NAME=hubmap-portal-ui
CONF_PATH=context/instance/app.conf
PORT=$1

[ "$PORT" = 5000 ] || [ "$PORT" = 5001 ] || die "Usage: $0 PORT
Requires port; On localhost must be 5000 or 5001 to match Globus whitelist."
[ -e "$CONF_PATH" ] || die "No $CONF_PATH
Copy example-app.conf and fill in blanks."

docker rm -f $CONTAINER_NAME || echo "$CONTAINER_NAME is not yet running."

etc/build/build.sh $IMAGE_NAME
docker run -d \
  --name $CONTAINER_NAME \
  -p $PORT:80 \
  --mount type=bind,source="$(pwd)"/"$CONF_PATH",target=/app/instance/app.conf \
  $IMAGE_NAME

green=`tput setaf 2 || echo ''`
reset=`tput sgr0 || echo ''`

echo $green
echo "To visit:   http://localhost:$PORT/"
echo "To connect: docker exec -it $CONTAINER_NAME /bin/bash"
echo "For logs:   docker logs --timestamps --follow $CONTAINER_NAME"
echo $reset
