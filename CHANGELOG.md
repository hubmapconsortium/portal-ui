# Changelog

## v0.0.19 - In Progress

### Added

- Only validate if in development.

### Changed

- Fix derived searches.
- Move vitessce into visualization section.
- Fix material-ui style conflicts with vitessce.

## v0.0.18 - 2020-05-18

### Added

- PropTypes on WrappedSearch.
- Translate result columns as well as filters.
- Make search columns appropriate to type.
- Get favicons on React pages.
- Call to action on home page.

### Changed

- Move VERSION down to the static directory, with a symlink in the original location.
- Upgrade Vitessce to 0.1.3 to fix small bugs and add description for tiff.
- Change scRNASEQ file searching.
- Separate detail pages by entity and update design.
- Display provenance table links for samples and datasets.

## v0.0.17 - 2020-05-15

### Added

- Python util to pull data from submodules.
- Appropriate facets for different types.

### Changed

- Fix Vitessce sizing bug.

## v0.0.16 - 2020-05-13

### Added

- Sort by last_modified.
- Hide entity_type facet.
- Different search configs for different types.
- Add data visualization in Vitessce for scRNASEQ and CODEX.
- Link to derived Samples and Datasets.
- Title on search page.

### Changed

- Use the code that had been in portal-search directly.
- Fix VisTabs panel overflow.
- Fix NoticeAlert to only display when errors exist.
- Moved react routes to own component.
- Make Webpack handle source maps and sassfiles
- Move unpkg dependencies to node_modules.
- Move Search and Home into App.
- Upgrade webpack.
- Pass api endpoints into App from flask.
- Move assay type to subheader instead of inline in ProvTable.
- Move ProvTable below title panel in Details.
- Fix NoticeAlert conditional causing a '0' to be rendered.

### Removed

- "Layout" from Search... just added border we didn't need.
- Removed old code to dump to nested tables.
- Remove vitessce from VisTabs.
- Remove unused fragments templates.
- Remove unused stylesheets.

## [v0.0.15](https://github.com/hubmapconsortium/portal-ui/tree/v0.0.15) - 2020/05/07

### Added

- Redirect to the correct entity type, if we've landed on the wrong one.
- Limit Flask session to just one hour to avoid problems with Globus tokens expiring.
- Redeploy script.
- Add git submodules for search-schema and ingest-validation-tools.
- Add `ASSETS_ENDPOINT` to app.conf.
- Add static/public to dockerignore
- Add stage to dockerfile to build static

### Changed

- Add provenance table to details.
- Add expansion panels for details data.
- Add prop types checks to components.
- Make details page react by default.
- Remove unused templates.
- Fix data in details top title panel.
- Remove breadcrumbs links from details top title panel.
- Moved files needed to build static inside context.

## v0.0.14 - Mistake

## [v0.0.13](https://github.com/hubmapconsortium/portal-ui/tree/v0.0.13) - 2020/05/03

### Added

- Added favicon
- Copy-and-paste new schemas... and we have fewer errors!

## [v0.0.12](https://github.com/hubmapconsortium/portal-ui/tree/v0.0.12) - 2020/04/28

### Changed

- Rename Docker Compose config.
- Remove actual endpoint from default_config.py: This must be provided during deployment.
- Fix react to show content on details pages.
- Use cookie for search.
- Add react header and footer
- Tweak to accommodate new ES document structure.
- Make header links relative to root.
- Update facets to reflect current index structure.

## [v0.0.11](https://github.com/hubmapconsortium/portal-ui/tree/v0.0.11) - 2020/04/16

### Added

- Hit Elasticsearch instance and start configuring facets.
- Add react, webpack, eslint, and styling dependencies.
- Make the Elasticsearch endpoint part of the config; Make it a single setting.
- Make the HuBMAP-Read group ID part of the config.
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
