#!/usr/bin/env bash
set -o errexit

. etc/test/utils.sh

copy_conf

start flake8
EXCLUDE=node_modules,etc/dev/organ-utils
# The organ-utils script uses the walrus operator (:=).
# Latest pycodestyle does support that syntax,
# but latest flake8 doesn't support the latest pycodestyle,
# or something like that.
# ¯\_(ツ)_/¯
flake8 --exclude=$EXCLUDE \
  || die "Try: autopep8 --in-place --aggressive -r . --exclude $EXCLUDE"
end flake8


start pytest
cd context
# vitessce_conf_builder is tested in its own repo.
pytest app --ignore app/api/vitessce_conf_builder
cd -
end pytest
