#!/usr/bin/env bash
set -o errexit

die() { set +v; echo "$*" 1>&2 ; exit 1; }

git diff --quiet || die 'Uncommitted changes: Stash or commit before push.'

diff VERSION <(curl -s https://raw.githubusercontent.com/hubmapconsortium/portal-ui/master/context/app/static/VERSION) \
  && die 'Update VERSION and commit.'

if ls CHANGELOG-*.md; then
  (
    echo '##' `cat VERSION` - `date +"%F"`
    echo
    # "-l" chomps and adds newline.
    perl -lpe '' CHANGELOG-*.md
    echo
    echo
    cat CHANGELOG.md
  ) > CHANGELOG.md.new
  mv CHANGELOG.md.new CHANGELOG.md
  git rm CHANGELOG-*.md
  git add .
  git commit -m 'Update CHANGELOG'
fi

VERSION=`cat VERSION`
VERSION_IMAGE_NAME=hubmap/portal-ui:$VERSION
LATEST_IMAGE_NAME=hubmap/portal-ui:latest

docker build --tag $VERSION_IMAGE_NAME context
docker tag $VERSION_IMAGE_NAME $LATEST_IMAGE_NAME
docker push $VERSION_IMAGE_NAME
docker push $LATEST_IMAGE_NAME

git tag $VERSION
git push origin --tags
