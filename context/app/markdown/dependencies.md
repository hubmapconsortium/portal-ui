# Dependencies

The portal has many dependencies:
Git submodules and Python and NodeJS packages are summarized here;
The services the portal relies on are [listed separately](/services).

## Git submodules

```
 79cab515ee56184a824c6755ff25fc6e2d1a3a65 context/ingest-validation-tools (v0.0.13-23-g79cab51)
```

## Python packages

`requirements.in`:

```
# Update requirements.txt if this file changes:
# pip install pip-tools
# pip-compile context/requirements.in --generate-hashes --allow-unsafe --output-file context/requirements.txt
Flask>=2.0.1
globus-sdk>=3.9.0
requests>=2.27.1
pyyaml>=5.4
python-datauri>=0.2.8
python-frontmatter>=0.5.0
hubmap-api-py-client>=0.0.9
hubmap-commons>=2.0.12

# Plain "git+https://github.com/..." references can't be hashed, so we point to a release zip instead.
https://github.com/hubmapconsortium/portal-visualization/archive/refs/tags/0.0.13.zip

# Security warning for older versions;
# Can be removed when commons drops prov dependency.
lxml>=4.9.1
```

## NodeJS packages

```
{
"@datapunt/matomo-tracker-js": "^0.5.1",
"@elastic/datemath": "^5.0.3",
"@elastic/eui": "^57.0.0",
"@emotion/react": "^11.9.0",
"@hms-dbmi-bgm/react-workflow-viz": "^0.1.9",
"@hookform/resolvers": "^2.9.10",
"@mui/icons-material": "^5.14.1",
"@mui/lab": "^5.0.0-alpha.137",
"@mui/material": "^5.14.1",
"@mui/styled-engine-sc": "^5.12.0",
"@mui/styles": "^5.14.1",
"@searchkit/client": "^3.0.0-canary.53",
"@searchkit/elastic-ui": "^3.0.0-canary.53",
"@searchkit/sdk": "^3.0.0-canary.53",
"@visx/axis": "^3.2.0",
"@visx/event": "^3.0.1",
"@visx/grid": "^3.2.0",
"@visx/group": "^3.0.0",
"@visx/legend": "^3.2.0",
"@visx/responsive": "^3.0.0",
"@visx/scale": "^3.2.0",
"@visx/shape": "^3.2.0",
"@visx/text": "^3.0.0",
"@visx/tooltip": "^3.1.2",
"ajv": "^6.12.3",
"bowser": "^2.11.0",
"buffer": "^6.0.3",
"chart.js": "^3.5.0",
"d3": "^5.16.0",
"d3-array": "^3.0.2",
"date-fns": "^2.27.0",
"fast-deep-equal": "^3.1.3",
"fromentries": "^1.2.0",
"html-webpack-plugin": "^5.5.3",
"immer": "^9.0.6",
"intersection-observer": "^0.11.0",
"lineupjsx": "^4.0.0",
"lodash": "^4.17.21",
"marked": "^2.1.3",
"nuka-carousel": "^6.0.3",
"pretty-bytes": "^5.3.0",
"prop-types": "^15.7.2",
"qs": "^6.11.0",
"react": "^18.2.0",
"react-chartjs-2": "^3.0.4",
"react-device-detect": "^2.2.2",
"react-dom": "^18.2.0",
"react-ga4": "^2.1.0",
"react-hook-form": "^7.38.0",
"react-intersection-observer": "^9.5.2",
"react-joyride": "^2.2.1",
"react-markdown": "^8.0.6",
"react-pdf": "^7.1.2",
"react-spring": "^8.0.27",
"react-vega": "^7.3.0",
"sass": "^1.53.0",
"searchkit": "^2.4.1-alpha.4",
"stream-browserify": "^3.0.0",
"styled-components": "^5.3.10",
"swc-loader": "^0.2.3",
"swr": "^2.1.5",
"timers-browserify": "^2.0.12",
"typeface-inter": "^3.12.0",
"universal-cookie": "^4.0.3",
"use-debounce": "^8.0.1",
"use-deep-compare-effect": "^1.8.1",
"use-resize-observer": "^7.0.0",
"uuid": "^8.3.2",
"vega": "^5.17.3",
"vega-lite": "^4.13.1",
"vitessce": "^3.1.1",
"web-vitals": "^1.1.0",
"whatwg-fetch": "^3.0.0",
"xml2js": "^0.6.0",
"yup": "^0.32.11",
"zustand": "^3.5.9"
}
```
