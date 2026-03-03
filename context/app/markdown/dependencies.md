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
hubmap-api-py-client>=0.0.11
hubmap-commons>=2.1.20
portal-visualization[full]>=0.4.21
python-frontmatter>=1.1.0
pyyaml>=6.0.2
requests>=2.32.5

# Development dependencies
boto3>=1.39.3
lxml>=6.0.0
pytest-mock>=3.15.1
pytest>=8.4.2
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
"@grafana/faro-react": "^1.5.0",
"@grafana/faro-web-sdk": "^1.5.0",
"@grafana/faro-web-tracing": "^1.5.0",
"@hookform/resolvers": "^3.3.4",
"@mui/icons-material": "^6.1.6",
"@mui/lab": "^6.0.0-beta.14",
"@mui/material": "^6.4.4",
"@mui/styled-engine": "npm:@mui/styled-engine-sc@latest",
"@mui/styled-engine-sc": "^6.4.3",
"@mui/system": "^6.4.3",
"@mui/x-date-pickers": "^7.22.2",
"@react-spring/web": "^9.7.3",
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
"cellpop": "^0.0.15",
"d3": "^7.9.0",
"d3-array": "^3.2.4",
"date-fns": "^3.6.0",
"deepmerge": "^4.3.1",
"elastic-builder": "^2.29.0",
"fast-deep-equal": "^3.1.3",
"history": "^5.3.0",
"html-react-parser": "^5.1.10",
"html2canvas": "^1.4.1",
"immer": "^10.0.4",
"isomorphic-dompurify": "^2.12.0",
"lineupjsx": "^4.6.0",
"lz-string": "^1.5.0",
"openkeynav": "^0.1.229",
"pretty-bytes": "^6.1.1",
"prop-types": "^15.8.1",
"react": "^18.3.1",
"react-device-detect": "^2.2.3",
"react-dom": "^18.3.1",
"react-ga4": "^2.1.0",
"react-hook-form": "^7.51.2",
"react-intersection-observer": "^9.8.1",
"react-markdown": "^9.0.1",
"react-pdf": "^9.2.1",
"reactify-wc": "^4.0.0",
"rehype-raw": "^7.0.0",
"styled-components": "^6.1.12",
"swr": "^2.2.5",
"universal-cookie": "^7.1.2",
"use-debounce": "^10.0.0",
"use-deep-compare-effect": "^1.8.1",
"use-resize-observer": "^9.1.0",
"uuid": "^9.0.1",
"vitessce": "^3.9.1",
"zod": "^3.22.4",
"zustand": "^4.5.2"
}
```
