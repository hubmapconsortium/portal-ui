#!/usr/bin/env bash
set -o errexit

die() { set +v; echo "$*" 1>&2 ; exit 1; }

[ -z "$NEXUS_TOKEN" ] && die "NEXUS_TOKEN needs to be defined."

cd `dirname $0`
export DATA_TYPES_QUERY=`cat queries/data-types.json`
export ENTITY_TYPES_QUERY=`cat queries/entity-types.json`
export DATASETS_QUERY=`cat queries/datasets.json`

mkdir outputs || echo 'outputs/ already exists...'
rm outputs/* || echo 'outputs/ already empty...'

for TARGET in scenarios/*.yml; do
  BASE=`basename $TARGET`
  for RATE in 1 5 10 15; do
    ZERO_PADDED=`printf "%02d" $RATE`
    export RATE
    ../node_modules/.bin/artillery \
      run $TARGET \
      --output outputs/$BASE-$ZERO_PADDED-per-second.json
  done
done

./summarize.py