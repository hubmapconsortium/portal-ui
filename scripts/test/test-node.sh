#!/usr/bin/env bash
set -o errexit

. scripts/test/utils.sh

cd context

start lint
npm run lint
end lint

start npm-test
npm run test
end npm-test

