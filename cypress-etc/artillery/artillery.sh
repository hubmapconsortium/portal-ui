#!/usr/bin/env bash
set -o errexit

die() { set +v; echo "$*" 1>&2 ; exit 1; }

[ -z "$NEXUS_TOKEN" ] && die "NEXUS_TOKEN needs to be defined."

cd `dirname $0`
export DATA_TYPES_QUERY=`cat queries/data-types.json`
export ENTITY_TYPES_QUERY=`cat queries/entity-types.json`
export DATASETS_QUERY=`cat queries/datasets.json`

mkdir outputs || echo 'outputs dir already exists...'
for TARGET in search; do
  for RATE in 1 5 10 15 20 25; do
    export RATE
    ../node_modules/.bin/artillery run $TARGET.yml --output outputs/$TARGET-`printf "%02d" $RATE`-per-second.json
  done
done

./summarize.py