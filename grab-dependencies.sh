#!/usr/bin/env bash
set -o errexit

MD=context/app/markdown/dependencies.md

cat << EOF > $MD
# Dependencies

The portal has many dependencies:
Git submodules and Python and NodeJS packages are summarized here;
The services the portal relies on are [listed separately](/services).

## Python packages

\`requirements.in\`:
\`\`\`
$(cat context/requirements.in)
\`\`\`

## NodeJS packages

EOF

python << 'EOF' >> $MD
import json
from pathlib import Path

package = json.loads(Path('context/package.json').read_text())
print('```')
print(json.dumps(package['dependencies'], sort_keys=True, indent=0))
print('```')
EOF
