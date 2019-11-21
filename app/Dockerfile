FROM tiangolo/uwsgi-nginx-flask:python3.7

COPY . /app

# NGINX should serve static content directly.
# https://github.com/tiangolo/uwsgi-nginx-flask-docker#custom-static-path
ENV STATIC_PATH /app/app/static

RUN pip install -r /app/requirements.txt
