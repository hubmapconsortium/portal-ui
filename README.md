# portal-ui
HuBMAP Data Portal:
This is a Flask app, using React on the front end and primarily Elasticsearch on the back end,
wrapped in a Docker container for deployment using Docker Compose.
It is deployed at [portal.hubmapconsortium.org](https://portal.hubmapconsortium.org/)

The Data Portal depends, directly or indirectly, on many other HuBMAP repos:

[![Repo diagram](https://docs.google.com/drawings/d/e/2PACX-1vQ1ISVanilVt3vewU6tekVirOxPpTsKMS3zXa8tL0J5JjdT9zS9adgXivm1ZcXxoyC_lctIlHVYhJuI/pub?w=922&amp;h=408)](https://docs.google.com/drawings/d/1q0IvliNTX0Xo9EzHTAoRZ2x1gatG_n0gOoLN7uVMJ4o/edit)

## Feedback

Issues with the Portal can be reported [via email](mailto:help@hubmapconsortium.org).
More information on how issues are tracked across HuBMAP is available
[here](https://portal.hubmapconsortium.org/docs/feedback).

## Checkout

Because we're using git submodules, a couple additional steps are needed with checkout:
```
git clone https://github.com/hubmapconsortium/portal-ui.git
git submodule init
git submodule update
git config --global submodule.recurse true # Run this once...
git pull                                   # Now pulls submodules every time!
```

If you need to work on the code in a submodule, I would encourage you to do that
in a separate top-level checkout. You certainly can push changes from inside
a submodule, but it just gets more confusing.

## Design
We try to have a design ready before we start coding.
Often, issues are filed in pairs, tagged [`design`](https://github.com/hubmapconsortium/portal-ui/issues?q=is%3Aissue+is%3Aopen+label%3Adesign)
and [`enhancement`](https://github.com/hubmapconsortium/portal-ui/labels/enhancement).
All designs are in [Figma](https://www.figma.com/files/team/834568130405102661/HuBMAP).
(Note that if that link redirects to `/files/recent`, you'll need to be added to the project, preferably with a `.edu` email, if you want write access.)

## Development
Please install both eslint and prettier plugins for your IDE.

After checking out the project, cd-ing into it, and setting up a Python3.7 virtual environment,
- Get `app.conf` from another developer and place it at `context/instance/app.conf`.
- Run `./dev-start.sh` to start the webpack dev and flask servers and then visit [localhost:5001](http://localhost:5001).

The webpack dev server serves all files within the public directory and provides hot module replacement for the react application;
The webpack dev server proxies all requests outside of those for files in the public directory to the flask server.

Note: Searchkit, our interface to Elasticsearch, has changed significantly in the lastest release. Documentation for version 2.0 can be found [here](http://searchkit.github.io/searchkit/stable/).

## Using Images
Images should displayed using the `source srcset` attribute. You should prepare four versions of the image starting at its original size and at 75%, 50% and 25% the original image's size preserving its aspect ratio. If available, you should also provide a 2x resolution for higher density screens. Once ready, each version of the image should be processed with an image optimizer.

Finally after processing, the images should be checked into the [`portal-images`](https://github.com/hubmapconsortium/portal-images) submodule.

### React File Structure
- Components with tests or styles should be placed in to their own directory.
- Styles should be placed in `style.*` where the extension is js for styled components or css for stylesheets.
- Tests should be placed in `*.spec.js` where the prefix is the name of the component.
- Each component directory should have an `index.js` which exports the component as default.
- Components which share a common domain can be placed in a directory within components named after the domain.

### Changelog files
Every PR should be reviewed, and every PR should include a new `CHANGELOG-something.md`:
These are concatenated by `push.sh`.

## Testing
[`test.sh`](test.sh) wraps all the tests and is run on Travis.
Python unit tests use Pytest, front end tests use Jest, an end-to-end tests use Cypress.
Look at the source code of the script to see how to run a particular set of tests.

Load tests [are available](end-to-end/artillery/), but they are not part of `test.sh`.

### Linting and pre-commit hooks
In addition, `test.sh` lints the codebase, and to save time, we also lint in a pre-commit hook.
If you want to bypass the hook, set `HUSKY_SKIP_HOOKS=1`.

You can also lint and auto-correct from the command-line:
```
npm run lint
npm run lint:fix
```

## Build, tag, and deploy
We plan to release new images Mondays and Wednesdays, and these are deployed to production the following day. [More details](README-deploy-qa.md#readme).

To build a new image for [dockerhub](https://hub.docker.com/repository/docker/hubmap/portal-ui),
and tag a release on github, just run:
```
./push.sh
```

Then, to redeploy `dev`, `test`, and `stage`:
```
# PSC will need a ssh public key for USERNAME.
./redeploy.sh $USERNAME dev
./redeploy.sh $USERNAME test
./redeploy.sh $USERNAME stage
```

IEC is responsible for deploying to production.

### Maintenace page

If the maintence page ever needs to be updated, you'll need to build the bundle,
and then make a PR against the `gateway` repo:

<details>

```
cd context/
npm run build:maintain
cd ${YOUR_HUBMAP_REPOS}/gateway
git checkout master; git pull
git checkout -b update-portal-ui-maintenance
cp ${YOUR_HUBMAP_REPOS}/portal-ui/context/app/static/js/maintenance/public/* \
   nginx/html/portal-ui-maintenance/
git add .; git commit -m 'Update portal-ui maintenance'
git push --set-upstream origin update-portal-ui-maintenance
```

</details>

### Understanding the build

To view visualizations of the production webpack bundle run `npm run build:analyze`.
The script will generate two files, report.html and stats.html, inside the public directory each showing a different visual representation of the bundle.

To build and run the docker image locally:
```sh
./docker.sh 5001 --follow
```
Our base image is based on [this template](https://github.com/tiangolo/uwsgi-nginx-flask-docker#quick-start-for-bigger-projects-structured-as-a-python-package).

In the deployments, our container is behind a NGINX reverse reproxy;
Here's a [simple demonstration](compose/) of how that works.

## Related projects and dependencies

Javascript:
- [`vitessce`](https://github.com/hubmapconsortium/vitessce): Visual integration tool for exploration of spatial single-cell experiments. Built on top of [deck.gl](https://deck.gl/).

Preprocessing:
- [`portal-containers`](https://github.com/hubmapconsortium/portal-containers): Docker containers for visualization preprocessing.
- [`airflow-dev`](https://github.com/hubmapconsortium/airflow-dev): CWL pipelines wrapping those Docker containers.
- [`search-api`](https://github.com/hubmapconsortium/search-api/tree/master/src/elasticsearch/addl_index_transformations): The Elasticsearch index the portal uses clean up the raw Neo4J export.

## Visualization via Vitessce

Data visualization is an integral part of the portal, allowing users to view the results of analysis pipelines or raw uploaded data easily directly in the browser.  How such data is processed and prepared for visualization in the client-side Javascript via [`vitessce`](https://github.com/hubmapconsortium/vitessce) can be found [here](./visualization-docs/README.md).
