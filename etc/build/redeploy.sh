#!/usr/bin/env bash
set -euo pipefail

die() { echo "Error: $*" >&2; exit 1; }

[ "$#" -eq 1 ] || die "usage: $0 USERNAME"
USER="$1"
TARGET="dev"
COMPOSE_CONFIG="hubmap.dev.yml"

log() {
    echo -e "\n==> [$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

log "Connecting to ingest server and executing deployment..."

ssh -t "$USER@ingest.$TARGET.hubmapconsortium.org" << 'EOF'
set -euo pipefail

echo -e "\n==> [Remote] Checking current user identity..."
echo 'whoami?' `whoami`

sudo -i << 'SU_EOF'
set -euo pipefail
echo 'whoami as root?' `whoami`

su - hive << 'HIVE_EOF'
set -euo pipefail
echo 'whoami as hive?' `whoami`

cd /opt/hubmap/portal-ui/compose

echo -e "\n==> [Remote] Current running portals:"
docker ps --filter "name=portal-ui" --format "table {{.Names}}\t{{.Status}}"

echo -e "\n==> [Remote] Stopping existing stack..."
docker compose -f hubmap.dev.yml down

echo -e "\n==> [Remote] Removing old 'latest' image cache..."
docker rmi hubmap/portal-ui:latest || true

echo -e "\n==> [Remote] Starting updated stack in detached mode..."
docker compose -f hubmap.dev.yml up -d

echo -e "\n==> [Remote] Verifying running portal containers:"
docker ps --filter "name=portal-ui" --format "table {{.Names}}\t{{.Status}}"

echo -e "\n==> [Remote] Checking package.json across instances..."
for container in portal-ui prod-portal-ui; do
    echo "--- Container: $container ---"
    if docker ps --format "{{.Names}}" | grep -q "^$container$"; then
        # Robustly check root or typical app subdirectories for package.json
        docker exec "$container" sh -c 'cat package.json 2>/dev/null || cat /app/package.json 2>/dev/null' | grep -E '"version"|"name"' || true
    else
        echo "WARNING: Container $container is not running!" >&2
    fi
done

HIVE_EOF
SU_EOF

EOF

log "Deployment complete!"
echo "Visit DEV Portal      --> https://portal.dev.hubmapconsortium.org/"
echo "Visit DEV Prod Portal --> https://portal-prod.dev.hubmapconsortium.org/"
