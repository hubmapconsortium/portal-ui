# Docker Compose

We first need to [install Docker Compose](https://docs.docker.com/compose/install/).

To start up the container with Dicker Compose:

````
sudo docker-compose -f compose/docker-compose.dev.yml up
````

Then you will see the logs of the containers in stdout. Once it's ready, you'll be able to access the portal at  http://localhost:8686/. If you want to run the container in background:

````
sudo docker-compose -f compose/docker-compose.dev.yml up -d
````

To safely stop the active container:

````
sudo docker-compose -f compose/docker-compose.dev.yml stop
````

The `docker-compose.test.yml` is used for deploying this portal-ui on the testing server.
