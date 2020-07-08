#!/usr/bin/env bash
set -o errexit

die() { set +v; echo "$*" 1>&2 ; exit 1; }

git diff --quiet || die 'Uncommitted changes: Stash or commit'
git checkout master

perl -i -pne 's/(\d+)$/$1+1/e' context/app/markdown/VERSION.md
VERSION=`cat VERSION`
BRANCH="release-$VERSION"
git checkout -b "$BRANCH"
git add .
git commit -m 'Version bump'

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


VERSION_IMAGE_NAME=hubmap/portal-ui:$VERSION
LATEST_IMAGE_NAME=hubmap/portal-ui:latest

docker build --tag $VERSION_IMAGE_NAME context
docker tag $VERSION_IMAGE_NAME $LATEST_IMAGE_NAME
docker push $VERSION_IMAGE_NAME
docker push $LATEST_IMAGE_NAME

git tag $VERSION
git push origin --tags
git push --set-upstream origin $BRANCH

echo "Open a new PR on github with $BRANCH."
