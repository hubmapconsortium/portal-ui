#!/usr/bin/env bash
set -o errexit

cd `dirname $0`
npm install
npm run cypress:run -- "$@"