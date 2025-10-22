#!/usr/bin/env bash

die() { set +v; echo "$*" 1>&2 ; exit 1; }

# Check language versions
INSTALLED_PYTHON_V=$(python --version | sed -e 's/.* /v/')
REQUIRED_PYTHON_V='v'$(cat .python-version)

[[ "$INSTALLED_PYTHON_V" = "$REQUIRED_PYTHON_V" ]] \
  || die "Installed python version ($INSTALLED_PYTHON_V) != required version ($REQUIRED_PYTHON_V) "

INSTALLED_NODE_V=$(node --version | sed 's/^v//')
REQUIRED_NODE_V=$(cat .nvmrc)

[[ "$INSTALLED_NODE_V" = "$REQUIRED_NODE_V" ]] \
  || die "Installed node version ($INSTALLED_NODE_V) != required version ($REQUIRED_NODE_V) " 

# Check whether to run NPM/UV install
NO_NPM=0
NO_UV=0
optspec=":hnps-:"
while getopts "$optspec" optchar; do
    case "${optchar}" in
        h) echo "usage: $0 [-h] [-n | --no-npm-install] [-p | --no-uv-install] [-s | --skip-install]"
           echo "  -h: show this help message"
           echo "  -n: skip npm install"
           echo "  -p: skip uv sync"
           echo "  -s: skip both installs"
           exit 0
           ;;
        -)
            case "${OPTARG}" in
                skip-install)
                    NO_NPM=1
                    NO_UV=1
                    echo "Skipping both installs due to arg: '--${OPTARG}'";
                    ;;
                no-npm-install)
                    NO_NPM=1
                    echo "Skipping npm install due to arg: '--${OPTARG}'";
                    ;;
                no-pip-install|no-uv-install)
                    NO_UV=1
                    echo "Skipping uv sync due to arg: '--${OPTARG}'";
                    ;;
                *)
                    if [ "$OPTERR" = 1 ] && [ "${optspec:0:1}" != ":" ]; then
                        echo "Unknown option --${OPTARG}" >&2
                    fi
                    ;;
            esac;;
        p)
            NO_UV=1
            echo "Skipping uv sync due to arg: '-${optchar}'"
            ;;
        n)
            NO_NPM=1
            echo "Skipping npm install due to arg: '-${optchar}'"
            ;;
        s)
            NO_NPM=1
            NO_UV=1
            echo "Skipping both installs due to arg: '-${optchar}'"
            ;;
        *)
            if [ "$OPTERR" != 1 ] || [ "${optspec:0:1}" = ":" ]; then
                echo "Non-option argument: '-${OPTARG}'" >&2
            fi
            ;;
    esac
done

set -o errexit
trap 'jobs -p | xargs kill' EXIT

CONTEXT=context

if [ "$NO_UV" -lt 1 ] ; then 
  uv sync --dev > /dev/null
fi

etc/dev/copy-app-conf.sh

cd $CONTEXT
if [ "$NO_NPM" -lt 1 ] ; then 
  npm install
fi

# Start subprocesses

FLASK_APP="app/main.py" python -m flask run --debug &

npm run lint || die 'Try "npm run lint:fix"'
npm run dev-server &
npm run storybook &

wait
