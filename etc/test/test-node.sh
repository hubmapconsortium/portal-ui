#!/usr/bin/env bash
set -o errexit

. etc/test/utils.sh

start lint
pnpm --filter ./context run lint
end lint

start pnpm-test
pnpm --filter ./context run test
end pnpm-test

