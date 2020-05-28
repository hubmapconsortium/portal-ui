#!/usr/bin/env bash
set -o errexit

die() { set +v; echo "$*" 1>&2 ; exit 1; }

git diff --quiet || die 'Uncommitted changes: Stash or commit before push.'

diff VERSION <(curl -s https://raw.githubusercontent.com/hubmapconsortium/portal-ui/master/context/app/static/VERSION) \
  && die 'Update VERSION and commit.'

(
  echo '##' `cat VERSION` - `date +"%F"`
  echo
  cat CHANGELOG-*.md
  echo
  cat CHANGELOG.md
) > CHANGELOG.md.new
mv CHANGELOG.md.new CHANGELOG.md
git rm CHANGELOG-*.md
git add .
git commit -m 'Update CHANGELOG'

VERSION_IMAGE_NAME=hubmap/portal-ui:$VERSION
LATEST_IMAGE_NAME=hubmap/portal-ui:latest

git tag $VERSION
git push origin --tags

docker build --tag $VERSION_IMAGE_NAME context
docker tag $VERSION_IMAGE_NAME $LATEST_IMAGE_NAME
docker push $VERSION_IMAGE_NAME
docker push $LATEST_IMAGE_NAME
