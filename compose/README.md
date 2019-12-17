# Docker Compose

This directory is used for deploying the portal-ui with docker-compose. The `dev.yml` can be used to spin up the contianer quickly by pulling the image from DockerHub. And the `test.yml` is used for deploying this portal-ui on the testing server. 

We first need to [install Docker Compose](https://docs.docker.com/compose/install/).

## Local dev

You'll first need to create the Flask configuration file based off `example-app.conf` found in the project root directory and place it at `portal-ui/context/instance/` (this directory needs to be created if not existing).

To start up the container with Dicker Compose, in the current directory of `compose/`:

````
docker-compose -f base.yml -f dev.yml up
````

Then you will see the logs of the containers in stdout. Once it's ready, you'll be able to access the portal at  http://localhost:5000/. If you want to run the container in background:

````
docker-compose -f base.yml -f dev.yml up -d
````

To safely stop the active container:

````
docker-compose -f base.yml -f dev.yml stop
````

## Deployment on huBMAP testing server

For testing deployment, the [HuBMAP Gateway](https://github.com/hubmapconsortium/gateway.git) handles the SSL certificates and domain name. All the requests to the `https://portal.test.hubmapconsortium.org/` will be send to the Gateway's nginx, then get proxied to the `portal-ui` container where another nginx listens on the port 80 of this container. 

Starting and stopping the container on testing environment is similar to the local dev, just replace `dev.yml` with `test.yml`.