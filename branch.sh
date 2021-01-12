#!/usr/bin/env bash
set -o errexit

die() { set +v; echo "$*" 1>&2 ; exit 1; }

[ "$#" -eq 0 ] && die 'Message required'
MESSAGE=`echo $@ | perl -pne '$_=ucfirst; chomp'`
DASHED=`echo $@ | perl -pne '$_=lc; chomp; s/\W+/-/g'`
BRANCH="$(whoami)/$DASHED"
git checkout -b $BRANCH

echo "- $MESSAGE" > CHANGELOG-$DASHED.md