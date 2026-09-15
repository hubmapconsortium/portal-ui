#!/usr/bin/env bash
set -o errexit

. etc/test/utils.sh

start lint
pnpm --filter ./context run lint
end lint

start pnpm-test
pnpm --filter ./context run test
end pnpm-test

# Builds every story. `pnpm tsc` already covers type errors in story files; this catches
# what it cannot -- broken imports, a bad .storybook config, an addon that fails to load --
# which otherwise goes unnoticed until someone opens Storybook.
start build-storybook
pnpm --filter ./context run build-storybook --quiet
end build-storybook
