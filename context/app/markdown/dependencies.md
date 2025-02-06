# Dependencies

The portal has many dependencies:
Git submodules and Python and NodeJS packages are summarized here;
The services the portal relies on are [listed separately](/services).

## Python packages

`requirements.in`:
```
# Update requirements.txt if this file changes:
# pip install pip-tools
# uv pip compile context/requirements.in --universal --output-file context/requirements.txt
Flask>=3.1.0
Flask[async]>=3.1.0
globus-sdk>=3.9.0
requests>=2.32.3
pyyaml>=6.0.1
python-datauri>=2.2.0
python-frontmatter>=1.1.0
hubmap-api-py-client>=0.0.11
hubmap-commons>=2.1.18
# As of 2023-08-24, this is the version of boto3 which is compatible with both the 
# portal-visualization->vitessce->ome-zarr dependency on aiobotocore~=2.5
# and the hubmap-commons dependency on boto3>=1.24.47
boto3==1.28.17

# Plain "git+https://github.com/..." references can't be hashed, so we point to a release zip instead.
https://github.com/hubmapconsortium/portal-visualization/archive/refs/tags/0.3.9.zip

# Security warning for older versions;
# Can be removed when commons drops prov dependency.
lxml>=4.9.1
```

## NodeJS packages

```
{
"@dagrejs/dagre": "^1.1.3",
"@datapunt/matomo-tracker-js": "^0.5.1",
"@elastic/elasticsearch": "^8.13.0",
"@fontsource-variable/inter": "^5.0.17",
"@grafana/faro-react": "^1.5.0",
"@grafana/faro-web-sdk": "^1.5.0",
"@grafana/faro-web-tracing": "^1.5.0",
"@hms-dbmi-bgm/react-workflow-viz": "^0.1.10",
"@hookform/resolvers": "^3.3.4",
"@mui/icons-material": "^6.1.6",
"@mui/lab": "^6.0.0-beta.14",
"@mui/material": "^6.1.6",
"@mui/styled-engine": "npm:@mui/styled-engine-sc@latest",
"@mui/styled-engine-sc": "^6.1.6",
"@mui/system": "^6.1.6",
"@mui/x-date-pickers": "^7.22.2",
"@react-spring/web": "^9.7.3",
"@searchkit/client": "^3.0.0-canary.53",
"@searchkit/sdk": "^3.0.0-canary.53",
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
"cellpop": "^0.0.12",
"chart.js": "^4.4.2",
"d3": "^7.9.0",
"d3-array": "^3.2.4",
"date-fns": "^3.6.0",
"deepmerge": "^4.3.1",
"elastic-builder": "^2.29.0",
"fast-deep-equal": "^3.1.3",
"history": "^5.3.0",
"html-react-parser": "^5.1.10",
"immer": "^10.0.4",
"isomorphic-dompurify": "^2.12.0",
"lineupjsx": "^4.6.0",
"lz-string": "^1.5.0",
"pretty-bytes": "^6.1.1",
"prop-types": "^15.8.1",
"react": "^18.3.1",
"react-chartjs-2": "^5.2.0",
"react-device-detect": "^2.2.3",
"react-dom": "^18.3.1",
"react-ga4": "^2.1.0",
"react-hook-form": "^7.51.2",
"react-intersection-observer": "^9.8.1",
"react-joyride": "^2.8.0",
"react-markdown": "^9.0.1",
"react-pdf": "^7.7.3",
"reactify-wc": "^4.0.0",
"rehype-raw": "^7.0.0",
"sass": "^1.72.0",
"searchkit": "^2.4.1-alpha.4",
"styled-components": "^6.1.12",
"swr": "^2.2.5",
"universal-cookie": "^7.1.2",
"use-debounce": "^10.0.0",
"use-deep-compare-effect": "^1.8.1",
"use-resize-observer": "^9.1.0",
"uuid": "^9.0.1",
"vitessce": "^3.4.5",
"zod": "^3.22.4",
"zustand": "^4.5.2"
}
```
