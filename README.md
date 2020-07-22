# portal-ui
HuBMAP Data Portal:
This is a Flask app, using React on the front end and primarily Elasticsearch on the back end,
wrapped in a Docker container for deployment using Docker Compose.
It is deployed at [portal.hubmapconsortium.org](https://portal.hubmapconsortium.org/)

The Data Portal depends, directly or indirectly, on many other HuBMAP repos:

[![Repo diagram](https://docs.google.com/drawings/d/e/2PACX-1vQ1ISVanilVt3vewU6tekVirOxPpTsKMS3zXa8tL0J5JjdT9zS9adgXivm1ZcXxoyC_lctIlHVYhJuI/pub?w=922&amp;h=408)](https://docs.google.com/drawings/d/1q0IvliNTX0Xo9EzHTAoRZ2x1gatG_n0gOoLN7uVMJ4o/edit)

## Checkout

Because we're using git submodules, a couple additional steps are needed with checkout:
```
git clone https://github.com/hubmapconsortium/portal-ui.git
git submodule init
git submodule update
```

Git does not update submodules on pull by default...
but you can make it the default:
```
git config --global submodule.recurse true # Run this once...
git pull                                   # Now pulls submodules!
```

If you need to work on the code in a submodule, I would encourage you to do that
in a separate top-level checkout. You certainly can push changes from inside
a submodule, but it just gets more confusing.

## Local demo using Docker
To build and run:
```sh
./docker.sh 5001 --follow
```
You will need Globus keys to login to the demo. The base image is based on [this template](https://github.com/tiangolo/uwsgi-nginx-flask-docker#quick-start-for-bigger-projects-structured-as-a-python-package).

A [simple demonstration](compose/) of how the NGINX reverse proxy works in Docker Compose.

## Development
Please install both eslint and prettier plugins for your IDE of choice.

After checking out the project, cd-ing into it, and setting up a Python3.7 virtual environment,

- in the `context/` directory
    - `npm install`
    - `wget https://raw.githubusercontent.com/hubmapconsortium/prov-vis/master/src/schema.json -O node_modules/@hubmap/prov-vis/es/schema.json`
    - (Note: Error with @hubmap-prov-vis dependency. Manually add
    the schema.json until [this issue is resolved](https://github.com/hubmapconsortium/portal-ui/issues/139).)
- in the root project directory
    - Get `app.conf` from another developer and place it at `context/instance/app.conf`.
    - Run `./dev-start.sh` to start the webpack dev and flask servers and then visit [localhost:5001](http://localhost:5001).

### Development servers
The webpack dev server serves all files within the public directory and provides hot module replacement for the react application.
The webpack dev server proxies all requests outside of those for files in the public directory to the flask server.

### Webpack bundle inspection
To view visualizations of the production webpack bundle run `npm run build:analyze`.
The script will generate two files, report.html and stats.html, inside the public directory each showing a different visual representation of the bundle.

### React File Structure
- Components with tests or styles should be placed in to their own directory.
- Styles should be placed in `style.*` where the extension is js for styled components or css for stylesheets.
- Tests should be placed in `*.spec.js` where the prefix is the name of the component.
- Each component directory should have an `index.js` which exports the component as default.
- Components which share a common domain can be placed in a directory within components named after the domain.

### Changelog files
Every PR should be reviewed, and every PR should include a new `CHANGELOG-something.md`:
These are concatenated by push.sh.

## Testing
[`test.sh`](test.sh) wraps all the tests and is run on Travis.
Low-level unit tests are in python (`pytest -vv`),
while end-to-end tests use [Cypress](https://docs.cypress.io/guides/overview/why-cypress.html) (`npm run cypress:open`).

## Linting
In the `context/` directory, the following commands can find and fix eslint problems:
```
npm run lint
npm run lint:fix
```

## Buid, tag, and deploy
To build a new image for [dockerhub](https://hub.docker.com/repository/docker/hubmap/portal-ui),
and tag a release for github, just run:
```
./push.sh
```
and merge the release branch to master in github.

Then, to redeploy `dev` and `test`:
```
# PSC will need a ssh public key for USERNAME.
./redeploy.sh $USERNAME dev
./redeploy.sh $USERNAME test
```

## Related projects and dependencies

Javascript / React UI components:
- [`vitessce`](https://github.com/hubmapconsortium/vitessce): Visual integration tool for exploration of spatial single-cell experiments. Built on top of [deck.gl](https://deck.gl/).
- [`prov-vis`](https://github.com/hubmapconsortium/prov-vis): Wrapper for [`4dn-dcic/react-workflow-viz`](https://github.com/4dn-dcic/react-workflow-viz) provenance visualization.

Preprocessing:
- [`portal-containers`](https://github.com/hubmapconsortium/portal-containers): Docker containers for visualization preprocessing.
- [`airflow-dev`](https://github.com/hubmapconsortium/airflow-dev): CWL pipelines wrapping those Docker containers.
- [`search-api`](https://github.com/hubmapconsortium/search-api/tree/master/src/elasticsearch/addl_index_transformations): The Elasticsearch index the portal uses clean up the raw Neo4J export.
