#!/usr/bin/env bash
set -o errexit

die() { set +v; echo "$*" 1>&2 ; exit 1; }

docker info >/dev/null 2>&1 || die 'Docker daemon is not running.'

git diff --quiet || die 'Uncommitted changes: Stash or commit'
git checkout main
git pull

MAJOR=$1

if [[ -z "$MAJOR" ]]; then
  NOW_EPOCH_DAY=`expr $(date +%s) / 86400`

  TAGS=`git for-each-ref --sort=creatordate --format '%(refname) %(creatordate)' refs/tags | tac`
  while read -r -d $'\n' TAG DATE; do
    if [[ $TAG =~ v0\.([0-9]+)\.0$ ]]; then
      echo "Last minor tag: $TAG"
      # Strip timezone info (last 6 characters)
      DATE=${DATE%??????}
      # Convert to epoch day
      REF_EPOCH_DAY=`expr $(date -j -f "%a %b %d %H:%M:%S %Y" "$DATE" "+%s") / 86400`
      echo "Reference epoch day: $REF_EPOCH_DAY"
      break
    fi
  done <<< "$TAGS"
 
  echo "Now epoch day: $NOW_EPOCH_DAY"

  DAYS_PAST_REF=`expr $NOW_EPOCH_DAY - $REF_EPOCH_DAY`

  echo "Days since last minor version: $DAYS_PAST_REF"

  if [[ $DAYS_PAST_REF -lt 14 ]]; then
    VERSION=`cd context && npm version patch --no-git-tag-version`
  else
    echo "End of 2-week cycle."
    VERSION=`cd context && npm version minor --no-git-tag-version`
  fi
else
  # major version bump, don't need to check for 2-week cycle
  VERSION=`cd context && npm version major`
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
