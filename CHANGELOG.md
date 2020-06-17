## v0.0.28 - 2020-06-17

- Stub out the docs to be filled in.
- Fix JS OOM error during build.
- Make Peter Kant's commitments explicit.


## v0.0.27 - 2020-06-16

- Adds an "expand" button to expand the Vitessce component to the full window size.
- Further configure jest and react-testing-library.
- Add eslint plugins for jest-dom and testing-library.
- Add mock service worker to mock responses. 
- Take advantage of Elasticsearch index routing.
- Add showcase page for Spraggins.


## v0.0.26 - 2020-06-14

- Add the CCF page to python tests.
- Fix bug in our template for the CCF.
- Fix errors displaying Visualization in table of contents.
- Enable free-text search. Caveats: 
  - Values represented with abbreviations will not be searchable until we have our own index up which expands them.
  - Only searching the column fields right now. Searching all fields could be done by:
    - Listing every single field in the config here.
    - Using ES mapping to copy fields during indexing. (https://github.com/hubmapconsortium/search-api/issues/63)
    - Doing it explicitly in the code which constructs our index.
- Provide hubmapPortalUrl to CCF.
- Make VERSION a MD file: Easy to remember path, ("/VERSION") and it doesn't try to download the file. Downside: No URL to curl that just returns the VERSION without anything else... but we could add a raw MD handler, if needed.
- Get doctests working in Python.


## v0.0.25 - 2020-06-09

- Add a Markdown page listing the assays, and add anchors based on the types Bill tells me we will see on Prod.
- Pull cypress into its own space so the docker build won't require it.
- Provide PORTAL_INDEX_PATH and CCF_INDEX_PATH, so we can hit the separated indexes, when available.
- Overhaul react file structure.
- Add Markdown from Peter Kant.
- Extend prettier/react in eslint config.
- Insure that changelog is written with a NL between each concatenated file.
- Refactor and fix minor issues in detail components.
- Install and setup jest and react-testing-library.
- Release branches were failing because there were not CHANGELOG-*.md.
- Include DOI and type in tab title.
- Pull latest field descriptions.


## v0.0.24 - 2020-06-05

- Integrate CCF-EUI.
- Add clean-webpack-plugin to webpack common config.

## v0.0.23 - 2020-06-04

- Move dag provenance to provenance tabs.
- Add donor metadata units where applicable.
- Add racial group to donor metadata.
- Fix prov graph width.
- Make metadata table description its own column.
- Add prettier formatter.
- Add webpack dev server.
- Split webpack config into separate files for each env.
- Add webpack bundle analyzer/visualizer.

## v0.0.22 - 2020-06-02

- Make short circuit length checks evaluate to booleans.
- Bump the ingest-validation-tools to add a mapping from metadata fields to descriptions.
- Make max width for content uniform.
- Update detail attribution page per v2 design.
- Use the Elasticsearch `_id` field, whose uniqueness is assured.

## v0.0.21 - 2020-05-28

- Concatenate separate files to build changelog on release; This will help us minimize merge conflicts
- Make theme accessible from styled components.
- Add dataset detail status icon.
- Add detail table of contents.

## v0.0.20 - 2020-05-27

### Added

- Triage issue template.
- Dag provenance to dataset detail page.

### Changed

- Use webpack aliasing to shorten relative path.
- Make Prov API request from client-side instead of server-side.

## v0.0.19 - 2020-05-18

### Added

- Only validate if in development.

### Changed

- Fix derived searches.
- Move vitessce into visualization section.
- Fix material-ui style conflicts with vitessce.
- Fix sample organ logic.
- Increase max height for detail file table.
- Make detail section padding uniform.

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
