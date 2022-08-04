#!/usr/bin/env bash
set -o errexit

. utils.sh


start changelog
echo "GITHUB_REF: $GITHUB_REF"
echo "GITHUB_HEAD_REF: $GITHUB_HEAD_REF"
echo "GITHUB_BASE_REF: $GITHUB_BASE_REF"
if [ "$GITHUB_REF" != 'refs/heads/main' ] \
   && [[ "$GITHUB_REF" != *'dependabot'* ]] \
   && [[ "$GITHUB_HEAD_REF" != *'dependabot'* ]] \
   && [ ! -z "$GITHUB_HEAD_REF" ] \
   && [ ! -z "$GITHUB_BASE_REF" ]; then
  git remote set-branches --add origin main
  git fetch
  # "--stat=1000" ensures that filenames are not truncated. 
  git diff --stat=1000 --compact-summary origin/main \
    | grep -e '^ CHANGELOG-\S\+ (new)' \
    || die 'Add a CHANGELOG-something.md at the top level'
fi
end changelog


start cap-dirs
# If there are exceptions, add something like:
# | grep -v path-to-ignore
CAP_DIRS=$(
  find context/app/static/js -type d \
  | egrep '/[A-Z][^/]+$'
)
NON_INDEX_DIRS=$(
  for D in $CAP_DIRS; do
    [ -e $D/index.* ] || echo $D
  done
)
[ -z "$NON_INDEX_DIRS" ] || die "These directories missing index files: $NON_INDEX_DIRS"
end cap-dirs
