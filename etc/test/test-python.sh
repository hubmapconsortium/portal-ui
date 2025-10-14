#!/usr/bin/env bash
set -o errexit

. etc/test/utils.sh

copy_conf

# Work from the context directory, where uv.lock is.
cd context

start flake8
EXCLUDE=node_modules,etc/dev/organ-utils
# The organ-utils script uses the walrus operator (:=).
# Latest pycodestyle does support that syntax,
# but latest flake8 doesn't support the latest pycodestyle,
# or something like that.
# ¯\_(ツ)_/¯
uv run flake8 --exclude=$EXCLUDE .. \
  || die "Try: uv run autopep8 --in-place --aggressive -r .. --exclude $EXCLUDE"
cd -
end flake8


start pytest
uv run pytest app
cd -
end pytest
