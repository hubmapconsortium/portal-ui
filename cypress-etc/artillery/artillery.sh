#!/usr/bin/env bash
set -o errexit

die() { set +v; echo "$*" 1>&2 ; exit 1; }

[ -z "$NEXUS_TOKEN" ] && die "NEXUS_TOKEN needs to be defined."

cd `dirname $0`
export DATA_TYPES_QUERY=`cat queries/data-types.json`
export ENTITY_TYPES_QUERY=`cat queries/entity-types.json`
export DATASETS_QUERY=`cat queries/datasets.json`

mkdir outputs || echo 'outputs dir already exists...'
for RATE in 10 20 40; do
  export RATE
  ../node_modules/.bin/artillery run artillery.yml --output outputs/$RATE.json
done
ls outputs