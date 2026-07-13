# Dependencies

The portal has many dependencies:
Git submodules and Python and NodeJS packages are summarized here;
The services the portal relies on are [listed separately](/services).

## Python packages

`pyproject.toml` dependencies:
```
# Production dependencies
Flask>=3.1.1
Flask[async]>=3.1.1
globus-sdk>=3.59.0
gunicorn>=23.0.0
hubmap-api-py-client>=0.0.11
hubmap-commons>=2.1.20
portal-visualization[full]>=0.5.9
python-frontmatter>=1.1.0
pyyaml>=6.0.2
requests>=2.32.5
udiagent>=0.2.6
udiagent[langfuse]>=0.2.6
whitenoise[brotli]>=6.9.0

# Development dependencies
boto3>=1.39.3
lxml>=6.1.0
pytest-mock>=3.15.1
pytest>=9.0.3
ruff>=0.14.0
```

## NodeJS packages

```
{
"@dagrejs/dagre": "^1.1.5",
"@datapunt/matomo-tracker-js": "^0.5.1",
"@elastic/elasticsearch": "^8.13.0",
"@fontsource-variable/inter": "^5.2.8",
"@fontsource-variable/jetbrains-mono": "^5.2.8",
"@hookform/resolvers": "^3.3.4",
"@mui/icons-material": "^7.3.11",
"@mui/lab": "7.0.0-beta.17",
"@mui/material": "^7.3.11",
"@mui/styled-engine": "npm:@mui/styled-engine-sc@latest",
"@mui/styled-engine-sc": "^7.3.10",
"@mui/system": "^7.3.11",
"@mui/x-date-pickers": "^8.28.7",
"@react-spring/web": "^10.0.3",
"@react-three/xr": "^6.0.0",
"@tanstack/react-virtual": "^3.2.0",
"@visx/axis": "^3.10.1",
"@visx/event": "^3.3.0",
"@visx/grid": "^3.5.0",
"@visx/group": "^3.3.0",
"@visx/legend": "^3.5.0",
"@visx/responsive": "^3.10.2",
"@visx/scale": "^3.5.0",
"@visx/shape": "^3.5.0",
"@visx/text": "^3.3.0",
"@visx/tooltip": "^3.3.0",
"@xyflow/react": "^12.0.3",
"d3": "^7.9.0",
"d3-array": "^3.2.4",
"date-fns": "^4.3.0",
"deepmerge": "^4.3.1",
"elastic-builder": "^2.29.0",
"history": "^5.3.0",
"html-react-parser": "^5.1.10",
"html2canvas": "^1.4.1",
"immer": "^10.0.4",
"isomorphic-dompurify": "^2.12.0",
"lineupjsx": "^4.6.0",
"lz-string": "^1.5.0",
"nuqs": "^2.8.9",
"openkeynav": "^0.1.229",
"pretty-bytes": "^6.1.1",
"react": "^19.2.6",
"react-device-detect": "^2.2.3",
"react-dom": "^19.2.6",
"react-error-boundary": "^6.1.2",
"react-ga4": "^2.1.0",
"react-hook-form": "^7.51.2",
"react-intersection-observer": "^9.8.1",
"react-markdown": "^9.0.1",
"react-pdf": "^9.2.1",
"reactify-wc": "^4.0.0",
"rehype-raw": "^7.0.0",
"scellop": "^0.1.1",
"styled-components": "^6.1.12",
"swr": "^2.4.1",
"udi-yac": "^0.1.6",
"universal-cookie": "^7.1.2",
"use-resize-observer": "^9.1.0",
"uuid": "^14.0.0",
"vega": "^6.2.0",
"vega-embed": "^7.1.0",
"vitessce": "4.0.0",
"zod": "^3.25.76",
"zustand": "^5.0.13"
}
```
