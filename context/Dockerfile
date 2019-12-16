FROM tiangolo/uwsgi-nginx-flask:python3.7

# NGINX should serve static content directly.
# https://github.com/tiangolo/uwsgi-nginx-flask-docker#custom-static-path
ENV STATIC_PATH /app/app/static

COPY requirements.txt /app
RUN pip install -r /app/requirements.txt

COPY . /app
