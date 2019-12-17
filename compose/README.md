# Docker Compose

We first need to [install Docker Compose](https://docs.docker.com/compose/install/).

To start up the container with Dicker Compose, in the current directory of `compose/`:

````
docker-compose -f base.yml -f dev.yml up
````

Then you will see the logs of the containers in stdout. Once it's ready, you'll be able to access the portal at  http://localhost:8686/. If you want to run the container in background:

````
docker-compose -f base.yml -f dev.yml up -d
````

To safely stop the active container:

````
docker-compose -f base.yml -f dev.yml stop
````

The `test.yml` is used for deploying this portal-ui on the testing server. And it works with the [HuBMAP Gateway](https://github.com/hubmapconsortium/gateway.git).
