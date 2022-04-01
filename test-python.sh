#!/usr/bin/env bash
set -o errexit

. utils.sh


# TODO: Is this needed for python tests?
# Should it be moved to ci if so?

# start copy-app-conf
# if [ ! -z "$GH_ACTIONS" ]; then
#   echo 'Running on ci...'
#   ./copy-app-conf.sh || (
#     echo 'app.conf before:'
#     cat context/instance/app.conf
#     echo 'Rewrite conf...'
#     sed -i 's/TODO/FAKE/' context/instance/app.conf
#     echo 'app.conf after:'
#     cat context/instance/app.conf
#   )
# fi
# end copy-app-conf


start flake8
EXCLUDE=node_modules,ingest-validation-tools,organ-utils
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
