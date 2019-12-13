# portal-ui
HuBMAP Data Portal front end

## Local demo using Docker
To build and run:
```sh
./docker.sh 5001 --follow
```
You will need globus keys to login to the demo. The base image is based on [this template](https://github.com/tiangolo/uwsgi-nginx-flask-docker#quick-start-for-bigger-projects-structured-as-a-python-package).

## Development
After checking out the project, cd-ing into it, and setting up a Python3 virtual environment,
run `quick-start.sh`,
update `app.conf` with the Globus client ID and client secret,
run `quick-start.sh` again,
and visit [localhost:5000](http://localhost:5000).

## Tag and release
To tag a new version for github and [dockerhub](https://hub.docker.com/repository/docker/hubmap/portal-ui),
increment `VERSION` and run:
```sh
./push.sh
```

## Deployment with docker compose

We first need to [install docker compose](https://docs.docker.com/compose/install/).

There are two docker-compose yaml files: `docker-compose.dev.yml` and `docker-compose.test.yml`. In local development, as an alternative, you can build and run the portal-ui with docker compose. 

````
sudo docker-compose -f docker-compose.dev.yml build
````

The build subcommand will build the docker image specified in the compose file. To start up the container:

````
sudo docker-compose -f docker-compose.dev.yml up
````

Then you will see the logs of the containers in stdout. Once it's ready, you'll be able to access the portal at  http://localhost:8686/. If you want to run the container in background:

````
sudo docker-compose -f docker-compose.dev.yml up -d
````

To safely stop the active container:

````
sudo docker-compose -f docker-compose.dev.yml stop
````

The `docker-compose.test.yml` is used for deploying this portal-ui on the testing server.

## Related projects and dependencies

Javascript / React UI components:
- [`vitessce`](https://github.com/hubmapconsortium/vitessce): Visual integration tool for exploration of spatial single-cell experiments. Built on top of [deck.gl](https://deck.gl/).
- [`prov-vis`](https://github.com/hubmapconsortium/prov-vis): Wrapper for [`4dn-dcic/react-workflow-viz`](https://github.com/4dn-dcic/react-workflow-viz) provenance visualization.
- [`portal-search`](https://github.com/hubmapconsortium/portal-search/): A simple, opinionated wrapper for [Searchkit](http://www.searchkit.co/) offering facetted search.

Preprocessing:
- [`portal-containers`](https://github.com/hubmapconsortium/portal-containers): Docker containers for visualization preprocessing.
- [`airflow-dev`](https://github.com/hubmapconsortium/airflow-dev): CWL pipelines wrapping those Docker containers.

