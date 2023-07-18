#!/usr/bin/env bash
set -o errexit
trap 'jobs -p | xargs kill' EXIT

die() { set +v; echo "$*" 1>&2 ; exit 1; }

# Check language versions

INSTALLED_PYTHON_V=$(python --version | sed -e 's/.* /v/')
REQUIRED_PYTHON_V='v'$(cat .python-version)

[[ "$INSTALLED_PYTHON_V" = "$REQUIRED_PYTHON_V" ]] \
  || die "Installed python version ($INSTALLED_PYTHON_V) != required version ($REQUIRED_PYTHON_V) "

INSTALLED_NODE_V=$(node --version)
REQUIRED_NODE_V=$(cat .nvmrc)

[[ "$INSTALLED_NODE_V" = "$REQUIRED_NODE_V" ]] \
  || die "Installed node version ($INSTALLED_NODE_V) != required version ($REQUIRED_NODE_V) " 


# Check whether to run NPM/PIP install
NO_NPM=0
NO_PIP=0
optspec=":np-:"
while getopts "$optspec" optchar; do
    case "${optchar}" in
        -)
            case "${OPTARG}" in
                no-npm-install)
                    NO_NPM=1
                    echo "Skipping npm install due to arg: '--${OPTARG}'";
                    ;;
                no-pip-install)
                    NO_PIP=1
                    echo "Skipping pip install due to arg: '--${OPTARG}'";
                    ;;
                *)
                    if [ "$OPTERR" = 1 ] && [ "${optspec:0:1}" != ":" ]; then
                        echo "Unknown option --${OPTARG}" >&2
                    fi
                    ;;
            esac;;
        p)
            NO_PIP=1
            echo "Skipping pip install due to arg: '-${optchar}'"
            ;;
        n)
            NO_NPM=1
            echo "Skipping npm install due to arg: '-${optchar}'"
            ;;
        *)
            if [ "$OPTERR" != 1 ] || [ "${optspec:0:1}" = ":" ]; then
                echo "Non-option argument: '-${OPTARG}'" >&2
            fi
            ;;
    esac
done

# Install

git submodule init
git submodule update
git config submodule.recurse true # So 'git pull' will update submodules.

CONTEXT=context

if [ "$NO_PIP" -lt 1 ] ; then 
  pip install -r $CONTEXT/requirements.txt > /dev/null
fi

etc/dev/copy-app-conf.sh

cd $CONTEXT
if [ "$NO_NPM" -lt 1 ] ; then 
  npm install
fi

# Start subprocesses

FLASK_ENV=development FLASK_APP="app/main.py" python -m flask run &

npm run lint || die 'Try "npm run lint:fix"'
npm run dev-server &
npm run storybook &

wait
