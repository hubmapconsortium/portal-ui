# portal-ui
HuBMAP Data Portal front end

## Get started
After checking out the project, cd-ing into it, and setting up a Python3 virtual environment,
run [`quick-start.sh`](quick-start.sh),
update `app/instance/app.conf` with the Globus client ID and client secret,
and visit [localhost:5000](http://localhost:5000).

## Docker
The base image in the Dockerfile is based on [this template](https://github.com/tiangolo/uwsgi-nginx-flask-docker#quick-start-for-bigger-projects-structured-as-a-python-package). To build and run:
```sh
./docker.sh 5001 --follow
```

## Tag and release
To tag a new version for github and [dockerhub](https://hub.docker.com/repository/docker/hubmap/portal-ui),
increment `VERSION` and run:
```sh
./push.sh
```
