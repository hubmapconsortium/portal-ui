#!/usr/bin/env bash
set -o errexit

MD=context/app/markdown/dependencies.md

cat << EOF > $MD
# Dependencies

The portal has many dependencies:
Git submodules and Python and NodeJS packages are summarized here;
The services the portal relies on are [listed separately](/services).

## Python packages

\`pyproject.toml\` dependencies:
\`\`\`
EOF

uv run python << 'EOF' >> $MD
import tomllib
from pathlib import Path

# Read pyproject.toml from the root directory
with open('pyproject.toml', 'rb') as f:
    pyproject = tomllib.load(f)

dependencies = pyproject.get('project', {}).get('dependencies', [])
dev_dependencies = pyproject.get('dependency-groups', {}).get('dev', [])

print("# Production dependencies")
for dep in sorted(dependencies):
    print(dep)

print("\n# Development dependencies")
for dep in sorted(dev_dependencies):
    print(dep)
EOF

cat << 'EOF' >> $MD
```

## NodeJS packages

EOF

uv run python << 'EOF' >> $MD
import json
from pathlib import Path

package = json.loads(Path('context/package.json').read_text())
print('```')
print(json.dumps(package['dependencies'], sort_keys=True, indent=0))
print('```')
EOF
