# Changelog

## v0.0.12 - In progress

## [v0.0.11](https://github.com/hubmapconsortium/portal-ui/tree/v0.0.11) - 2020/04/16
### Added
- Hit Elasticsearch instance and start configuring facets.
- Add react, webpack, eslint, and styling dependencies.
- Make the Elasticsearch endpoint part of the config; Make it a single setting.
- Make the HuBMAP-Read group ID a part of the config.
- Use Elasticsearch to read single records.
- Use the HuBMAP API ES instance for client-side faceted search, too.

## [v0.0.10](https://github.com/hubmapconsortium/portal-ui/tree/v0.0.10) - 2020/03/06
### Added
- Handle 401, when Globus token has expired, but Flask session is still active.
- After login, check groups membership and 401 if not in HuBMAP.
### Changed
- Use API the right way and fix prov-vis.

## [v0.0.9](https://github.com/hubmapconsortium/portal-ui/tree/v0.0.9) - 2020/02/07
### Added
- Demo of end-to-end UMAP scatterplot.

## [v0.0.8](https://github.com/hubmapconsortium/portal-ui/tree/v0.0.8) - 2020/01/31
### Changed
- Demonstrate Docker Compose reverse proxy.
- Simplify Vitessce demo to just a scatterplot with data from HuBMAP.
- Add Cypress.io tests.

## [v0.0.7](https://github.com/hubmapconsortium/portal-ui/tree/v0.0.7) - 2020-01-08
### Added
- Link to JSON from details, and test.
- Added many more rules to schema, and confirm that fields present are appropriate for type.
- Nice human readable error pages for 400, 403, 404 (routing and API), and 504.
- More realistic Vitessce demo, using the Mermaid data.
- Better labels on prov nodes, and handle clicks.
### Changed
- Fix redirect problem.
- Better documentation for IS_MOCK config option.
- Post-merge Travis runs were failing; fixed now.
- Fix docker.sh by being tighter about routing for markdown pages.
- app.conf is no longer read during tests.

## [v0.0.6](https://github.com/hubmapconsortium/portal-ui/tree/v0.0.6) - 2019-12-18
### Added
- Make protocols.io links work.
- Github issues can be referenced in the schema, and if there is a related failure,
a link will be given in the UI.
### Changed
- Clarify deployment process.

## [v0.0.5](https://github.com/hubmapconsortium/portal-ui/tree/v0.0.5) - 2019-12-16
### Added
- Format details page headers.
- Support markdown pages.
- Add Searchkit.
- Config option to use mock API responses.
- Docker compose configuration.
### Removed
- Removed "TODO" styles, for now.

## [v0.0.4](https://github.com/hubmapconsortium/portal-ui/tree/v0.0.4) - 2019-11-22
### Added
- Globus login/logout. Handle expired tokens.
- Hit the real API.
- Add a Vitessce hello-world to each details page.
- Add Dockerfile with nginx and uWSGI, and minimal Travis test.
- Script to tag and push to github and dockerhub.

## [v0.0.2](https://github.com/hubmapconsortium/portal-ui/tree/v0.0.2) - 2019-10-30
### Added
- Start applying Bootstrap styles.
- Add a minimalist browse page and homepage.
- Check that tags are balanced.
- Add a "File" page; Start specializing the details pages.
- Add provenance to fake UI, and add it to details page.
- Add fake contribution info to the details page.

## [v0.0.1](https://github.com/hubmapconsortium/portal-ui/tree/v0.0.1) - 2019-10-11
### Added
- Simple flask app with minimal routes. Test that known routes are 200, unknown are 404.
- With a just fresh checkout, `quick-start.sh` will bring up the flask app in development mode. Tested.
- Minimal, intentionally ugly CSS to flag the work that still needs to be done.
- Stub API. Demonstrate testing that an API call produces expected HTTP GET.
- Recursive tabular details rendering. Test input/output pairs.
