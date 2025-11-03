#!/usr/bin/env bash
set -o errexit

die() { set +v; echo "$*" 1>&2 ; exit 1; }

usage() {
  echo "Usage: $0 [--dry-run] [major]"
  echo "  --dry-run: Skip Docker build/push and git push operations"
  echo "  major: Force a major version bump (otherwise automatic based on 2-week cycle)"
  exit 1
}

# Parse arguments
DRY_RUN=false
MAJOR=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --help|-h)
      usage
      ;;
    *)
      MAJOR=$1
      shift
      ;;
  esac
done

if [[ "$DRY_RUN" == "true" ]]; then
  echo "DRY RUN MODE: No pushes will be performed"
else
  docker info >/dev/null 2>&1 || die 'Docker daemon is not running.'
fi

git diff --quiet || die 'Uncommitted changes: Stash or commit'
git checkout main
git pull

if [[ -z "$MAJOR" ]]; then
  NOW_EPOCH_DAY=`expr $(date +%s) / 86400`

  TAGS=`git for-each-ref --sort=creatordate --format '%(refname) %(creatordate)' refs/tags | tac`
  while read -r -d $'\n' TAG DATE; do
    if [[ $TAG =~ ([0-9]+)\.([0-9]+)\.0$ ]]; then
      echo "Last minor tag: $TAG"
      # Strip timezone info (last 6 characters)
      DATE=${DATE%??????}
      # Convert to epoch day - support both macOS and Linux date commands
      if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS date command
        REF_EPOCH_DAY=`expr $(date -j -f "%a %b %d %H:%M:%S %Y" "$DATE" "+%s") / 86400`
      else
        # Linux date command
        REF_EPOCH_DAY=`expr $(date -d "$DATE" "+%s") / 86400`
      fi
      echo "Reference epoch day: $REF_EPOCH_DAY"
      break
    fi
  done <<< "$TAGS"
 
  echo "Now epoch day: $NOW_EPOCH_DAY"

  DAYS_PAST_REF=$(($NOW_EPOCH_DAY - $REF_EPOCH_DAY))
  echo "Days since last minor version: $DAYS_PAST_REF"

  if [[ $DAYS_PAST_REF -lt 14 ]]; then
    VERSION=`cd context && npm version patch --no-git-tag-version`
    uv version --bump patch
  else
    echo "End of 2-week cycle."
    VERSION=`cd context && npm version minor --no-git-tag-version`
    uv version --bump minor
  fi
else
  # major version bump, don't need to check for 2-week cycle
  VERSION=`cd context && npm version major --no-git-tag-version`
  uv version --bump major
fi


echo "Version: $VERSION"

./grab-dependencies.sh

git add context/package*.json
git add pyproject.toml
git add context/app/markdown/dependencies.md
git commit -m "Version bump to $VERSION"

if ls CHANGELOG-*.md; then
  (
    echo '# Changelog'
    echo 
    echo '##' $VERSION - `date +"%F"`
    echo
    # "-l" chomps and adds newline.
    perl -lpe '' CHANGELOG-*.md
    echo
    echo
    # Skip the first line of the existing changelog (the header).
    tail -n +2 context/app/markdown/CHANGELOG.md
  ) > CHANGELOG.md.new
  mv CHANGELOG.md.new context/app/markdown/CHANGELOG.md
  git rm CHANGELOG-*.md
  git add context/app/markdown/CHANGELOG.md
  git commit -m 'Update CHANGELOG'
fi

VERSION_IMAGE_NAME=hubmap/portal-ui:$VERSION
LATEST_IMAGE_NAME=hubmap/portal-ui:latest

if [[ "$DRY_RUN" == "true" ]]; then
  echo "DRY RUN: Would build and push Docker images:"
  echo "  - $VERSION_IMAGE_NAME"
  echo "  - $LATEST_IMAGE_NAME"
  echo "DRY RUN: Would create git tag and push:"
  echo "  - git tag $VERSION"
  echo "  - git push origin --tags"
  echo "  - git push origin"
else
  etc/build/build.sh $VERSION_IMAGE_NAME
  docker tag $VERSION_IMAGE_NAME $LATEST_IMAGE_NAME
  docker push $VERSION_IMAGE_NAME
  docker push $LATEST_IMAGE_NAME
  
  git tag $VERSION
  git push origin --tags
  git push origin
fi