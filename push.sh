#!/usr/bin/env bash
set -o errexit

die() { set +v; echo "$*" 1>&2 ; exit 1; }

git diff --quiet || die 'Uncommitted changes: Stash or commit'
git checkout master
git pull

EXPECTED_MINOR=v0.`expr $(date +%s) / 86400 / 14 - 1320`

# The docs say that a git tag will be created by default.
# That would be useful, but it doesn't see to be happening for me.
# Add additional flag to override.
# https://docs.npmjs.com/cli/v6/commands/npm-version
VERSION=`cd context && npm version patch --no-git-tag-version`

if [[ $VERSION != $EXPECTED_MINOR* ]]; then
  echo "End of 2-week cycle. Setting minor version to: $EXPECTED_MINOR"
  VERSION=`cd context && npm version $EXPECTED_MINOR.0 --no-git-tag-version`
fi
echo "Version: $VERSION"

git add .
git commit -m "Version bump to $VERSION"

if ls CHANGELOG-*.md; then
  (
    echo '##' $VERSION - `date +"%F"`
    echo
    # "-l" chomps and adds newline.
    perl -lpe '' CHANGELOG-*.md
    echo
    echo
    cat CHANGELOG.md
  ) > CHANGELOG.md.new
  mv CHANGELOG.md.new context/app/markdown/CHANGELOG.md
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

# We want to keep submodules up to date,
# but safer to do it after making an image than before.
git submodule foreach '
  echo "was:" `git rev-parse HEAD`
  git checkout master
  git pull
  echo "now:" `git rev-parse HEAD`
'
git add .
git commit -m 'Update submodules' || echo 'Nothing to commit; Continue to git push...'

git push origin
