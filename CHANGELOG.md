# Changelog

## v0.0.7 - In progress
### Changed
- Fix redirect problem.
- Better documentation for IS_MOCK config option.
- Expand schema to cover more documents.

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
