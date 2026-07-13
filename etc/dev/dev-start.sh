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
        h) echo "usage: $0 [-h] [-n | --no-pnpm-install] [-p | --no-uv-install] [-s | --skip-install]"
           echo "  -h: show this help message"
           echo "  -n: skip pnpm install"
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
                no-npm-install|no-pnpm-install)
                    NO_NPM=1
                    echo "Skipping pnpm install due to arg: '--${OPTARG}'";
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
            echo "Skipping pnpm install due to arg: '-${optchar}'"
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

if [ "$NO_NPM" -lt 1 ] ; then
  pnpm install
fi

# Start subprocesses
cd $CONTEXT

# Remove any stale production build output (app/static/public) left behind by a
# prior `pnpm build`. Flask only runs in Vite dev mode when no manifest.json is
# present (see flask_static_digest.vite_dev_mode); otherwise it serves the
# prebuilt hashed bundle off disk, masking local source changes behind a stale
# build. No-op when the dir is already absent.
pnpm run clean

# --no-sync: this script already syncs above (unless -p/--no-uv-install is passed), so let uv
# use the existing env rather than re-syncing and undoing the skip-install flag.
FLASK_APP="app/main.py" uv run --no-sync python -m flask run --debug &

pnpm run lint || die 'Try "pnpm run lint:fix"'
pnpm run dev-server &
pnpm run storybook &

wait
