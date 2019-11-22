#!/usr/bin/env bash
set -o errexit

die() { set +v; echo "$*" 1>&2 ; exit 1; }
git diff --quiet || die 'Uncommitted changes: Stash or commit before push.'

VERSION=`cat VERSION`
IMAGE_NAME = hubmap/portal-ui:$VERSION

git tag $VERSION
git push origin --tags

docker build --tag $IMAGE_NAME context
docker push $IMAGE_NAME
