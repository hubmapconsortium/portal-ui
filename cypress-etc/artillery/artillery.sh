#!/usr/bin/env bash
set -o errexit

cd `dirname $0`

export HOME_PAGE_DATA_TYPES=`cat home-page-data-types.json`
export HOME_PAGE_ENTITY_TYPES=`cat home-page-entity-types.json`

../node_modules/.bin/artillery run artillery.yml