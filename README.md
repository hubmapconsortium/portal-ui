# flask-data-portal
Flask for HuBMAP Data Portal front end

## Getting started
After checking out the project:
```
pip install -r requirements.txt
export FLASK_APP=portal
export FLASK_ENV=development
flask run --port 8000
```
(Port is only required because our test account with Globus
expects the redirect after login to be port 8000.)

Then visit [localhost:8000](http://localhost:8000)

## Contributing
Do your work in a feature branch from master. To run tests locally:
```
pip install -r requirements-dev.txt
./test.sh
```
When you're ready, make a PR on github.
