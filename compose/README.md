# Docker Compose

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
