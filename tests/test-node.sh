#!/usr/bin/env bash
set -o errexit

. utils.sh

cd context

start lint
npm run lint
end lint

start npm-test
npm run test
end npm-test

