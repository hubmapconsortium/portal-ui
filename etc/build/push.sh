#!/usr/bin/env bash
set -o errexit

die() { set +v; echo "$*" 1>&2 ; exit 1; }

git diff --quiet || die 'Uncommitted changes: Stash or commit'
git checkout main
git pull

get_minor_version() {
  REF_MINOR=$1
  REF_DATE=$2
  REF_EPOCH_DAY=`expr $(date -j -f "%d %b %Y" "$REF_DATE" +%s) / 86400`
  NOW_EPOCH_DAY=`expr $(date +%s) / 86400`
  DAYS_PAST_REF=`expr $NOW_EPOCH_DAY - $REF_EPOCH_DAY`
  echo v0.`expr $REF_MINOR + $DAYS_PAST_REF / 14`
  # Integer division truncates toward 0 for both positive and negative,
  # so this doesn't work if the reference date is in the future.
}

EXPECTED_MINOR=`get_minor_version 9 '01 JAN 2021'`

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

./grab-dependencies.sh

git add context/package*.json
git add context/app/markdown/dependencies.md
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
  git add context/app/markdown/CHANGELOG.md
  git commit -m 'Update CHANGELOG'
fi

VERSION_IMAGE_NAME=hubmap/portal-ui:$VERSION
LATEST_IMAGE_NAME=hubmap/portal-ui:latest

etc/build/build.sh $VERSION_IMAGE_NAME
docker tag $VERSION_IMAGE_NAME $LATEST_IMAGE_NAME
docker push $VERSION_IMAGE_NAME
docker push $LATEST_IMAGE_NAME

git tag $VERSION
git push origin --tags
git push origin
