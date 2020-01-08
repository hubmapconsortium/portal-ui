# Docker Compose

This directory is used for deploying the portal-ui with docker-compose.
The `dev.yml` can be used to spin up the container quickly by pulling the image from DockerHub,
and the `test.yml` is used for deploying this portal-ui on the testing server.

You'll need [Docker Compose](https://docs.docker.com/compose/install/) installed.

## Deployments

### Local dev deployment

The local dev deployment mimics the test and prod deployments
by including a nginx reverse proxy container,
separate from the nginx already included in the portal-ui container.
This nginx container stands in for the gateway provided
in test and prod environments.

You'll need a configuration file in place at `context/instance/app.conf`:
Globus access requires a secret key, so this is not checked in:
Instead ask another developer to share theirs.

Then, confirm that nothing is already running on http://localhost:5000/.

To start up the container with Docker Compose, `cd compose` and then:

````
docker-compose -f base.yml -f dev.yml up
````

You will see the logs of the containers in stdout.
Once it's ready, you'll be able to access the portal at http://localhost:5000/.
If you want to run the container in background:

````
docker-compose -f base.yml -f dev.yml up -d
````

To safely stop the active container:

````
docker-compose -f base.yml -f dev.yml stop
````

### HuBMAP testing server deployment

For testing deployment, the [HuBMAP Gateway](https://github.com/hubmapconsortium/gateway.git) handles the SSL certificates and domain name.
All the requests to `https://portal.test.hubmapconsortium.org/` will be sent to the Gateway's nginx,
then proxied to the `portal-ui` container.

Starting and stopping the container in the testing environment is similar to the local dev, just replace `dev.yml` with `test.yml`.

### HuBMAP production server deployment

*TODO*
