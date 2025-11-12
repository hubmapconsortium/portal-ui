#!/usr/bin/env bash
set -o errexit

. etc/test/utils.sh

copy_conf


start ruff
# Ruff is a fast Python linter that replaces flake8
# It supports Python 3.12 syntax including match statements
uv run ruff check context \
  || die "Try: uv run ruff check --fix context"
uv run ruff format --check context \
  || die "Try: uv run ruff format context"
end ruff


start pytest
uv run pytest context/app
end pytest
