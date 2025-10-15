#!/usr/bin/env bash
set -o errexit

. etc/test/utils.sh

copy_conf

# Work from the context directory, where uv.lock is.
cd context

start ruff
# Ruff is a fast Python linter that replaces flake8
# It supports Python 3.12 syntax including match statements
uv run ruff check .. \
  || die "Try: uv run ruff check --fix .."
uv run ruff format --check .. \
  || die "Try: uv run ruff format .."
end ruff


start pytest
uv run pytest app
end pytest
