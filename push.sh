#!/usr/bin/env bash
set -o errexit

die() { set +v; echo "$*" 1>&2 ; exit 1; }
git diff --quiet || die 'Uncommitted changes: Stash or commit before push.'

VERSION=`cat VERSION`
VERSION_IN_CHANGELOG="$VERSION - In progress"
grep "$VERSION_IN_CHANGELOG" CHANGELOG.md || die "Missing from CHANGELOG.md: '$VERSION_IN_CHANGELOG'"

VERSION_IMAGE_NAME=hubmap/portal-ui:$VERSION
LATEST_IMAGE_NAME=hubmap/portal-ui:latest

git tag $VERSION
git push origin --tags

docker build --tag $VERSION_IMAGE_NAME context
docker tag $VERSION_IMAGE_NAME $LATEST_IMAGE_NAME
docker push $VERSION_IMAGE_NAME
docker push $LATEST_IMAGE_NAME
