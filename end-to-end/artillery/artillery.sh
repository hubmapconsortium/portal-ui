#!/usr/bin/env bash
set -o errexit

die() { set +v; echo "$*" 1>&2 ; exit 1; }

[ -z "$GROUPS_TOKEN" ] && die "GROUPS_TOKEN needs to be defined."

cd `dirname $0`

./generate-assets-ranges.py > payloads/generated-assets-ranges.csv

export DATA_TYPES_QUERY=`cat queries/data-types.json`
export ENTITY_TYPES_QUERY=`cat queries/entity-types.json`
export DATASETS_QUERY=`cat queries/datasets.json`
export CCF_QUERY=`cat queries/ccf.json`

mkdir outputs || echo 'outputs/ already exists...'
rm outputs/* || echo 'outputs/ already empty...'

for TARGET in scenarios/*.yml; do
  BASE=`basename $TARGET`
  for RATE in 10 20 30 40; do
    ZERO_PADDED=`printf "%02d" $RATE`
    export RATE
    ../node_modules/.bin/artillery \
      run $TARGET \
      --insecure \
      --output outputs/$BASE-$ZERO_PADDED-per-second.json
  done
done

./summarize.py
