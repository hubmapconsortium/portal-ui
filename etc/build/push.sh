#!/usr/bin/env bash
set -o errexit

die() { set +v; echo "$*" 1>&2 ; exit 1; }

docker info >/dev/null 2>&1 || die 'Docker daemon is not running.'

git diff --quiet || die 'Uncommitted changes: Stash or commit'
git checkout main
git pull

MAJOR=$1

if [[ -z "$MAJOR" ]]; then
  get_last_minor_version() {
    TAGS=`git for-each-ref --sort=creatordate --format '%(refname) %(creatordate)' refs/tags | tac`
    # Iterate over tags to find date of last one with patch of .0
    for TAG in $TAGS; do
      if [[ $TAG == refs/tags/v* ]]; then
        MINOR=`echo $TAG | perl -pne 's/.*v0\.(\d+)\.\d+/\1/'`
        if [[ $MINOR -eq $1 ]]; then
          REF_DATE=`echo $TAG | perl -pne 's/.*v0\.\d+\.\d+ //'`
          break
        fi
      fi
    done

    REF_EPOCH_DAY=`expr $(date -j -f "%d %b %Y" "$REF_DATE" +%s) / 86400`
    NOW_EPOCH_DAY=`expr $(date +%s) / 86400`
    DAYS_PAST_REF=`expr $NOW_EPOCH_DAY - $REF_EPOCH_DAY`

    echo "Days since last minor version: $DAYS_PAST_REF"
    echo v0.`expr $REF_MINOR + $DAYS_PAST_REF / 14`
    # Integer division truncates toward 0 for both positive and negative,
    # so this doesn't work if the reference date is in the future.
  }

  DAYS_PAST_REF=`get_last_minor_version`

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

die

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
