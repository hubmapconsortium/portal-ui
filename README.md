# flask-data-portal
Flask for HuBMAP Data Portal front end

## Getting started
After checking out the project:
```sh
pip install -r requirements.txt
export FLASK_APP=portal
export FLASK_ENV=development
# In production, the redirect after login should be https;
# not required during development.
export OAUTHLIB_INSECURE_TRANSPORT=1
# These are only for development:
export GLOBUS_CLIENT_ID='12518f0d-4594-4632-8c4c-a6839024d238',
export GLOBUS_CLIENT_SECRET='gEfGGE09nMMjwZxWafL+2/M3UqcGl9czSL72H+O1xuU=',
flask run --port 8000
```
(Port is only required because our test account with Globus
expects the redirect after login to be port 8000.)

Then visit [localhost:8000](http://localhost:8000)

## Contributing
Do your work in a feature branch from master. To run tests locally:
```sh
pip install -r requirements-dev.txt
./test.sh
```
When you're ready, make a PR on github.
