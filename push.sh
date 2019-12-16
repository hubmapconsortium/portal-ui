#!/usr/bin/env bash
set -o errexit

die() { set +v; echo "$*" 1>&2 ; exit 1; }
git diff --quiet || die 'Uncommitted changes: Stash or commit before push.'

VERSION=`cat VERSION`
grep "$VERSION - In progress" CHANGELOG.md || die "In CHANGELOG.md, $VERSION should be 'in progress'"

IMAGE_NAME=hubmap/portal-ui:$VERSION
grep "$IMAGE_NAME" compose/base.yml || die "Update compose/base.yml: $IMAGE_NAME"

git tag $VERSION
git push origin --tags

docker build --tag $IMAGE_NAME context
docker push $IMAGE_NAME
