# portal-ui
HuBMAP Data Portal front end

## Get started
After checking out the project, cd-ing into it, and setting up a Python3 virtual environment,
run [`quick-start.sh`](quick-start.sh),
update `app/instance/app.conf` with the Globus client ID and client secret,
and visit [localhost:5000](http://localhost:5000).

## Docker
The base image in the Dockerfile is based on [this template](https://github.com/tiangolo/uwsgi-nginx-flask-docker#quick-start-for-bigger-projects-structured-as-a-python-package). To build and run:
```
docker build --tag hubmap:portal-ui .
docker run -d --name portal-ui -p 8080:80 hubmap:portal-ui
docker logs portal-ui
docker ps -qa | xargs docker rm
```

## Contribute
Do your work in a feature branch from master. To run tests locally:
```sh
pip install -r requirements-dev.txt
./test.sh
```
When you're ready, make a PR on github.

## Tag and release
Git tags are used to pin versions for Docker builds.
First, checkout and pull the latest `master`.
```sh
git checkout master
git pull
```
Double check that this version of the code works,
and that [`CHANGELOG.md`](CHANGELOG.md) is up to date.
Then create a tag, and push:
```sh
git tag v0.0.x
git push origin --tags
```
