FROM node:12.16.3-alpine as builder
WORKDIR /work
RUN apk add --no-cache python git

# COPY only what is needed so layers can be cached.
COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY .babelrc .babelrc
COPY build-utils build-utils
COPY app app
COPY ingest-validation-tools ingest-validation-tools
COPY portal-visualization portal-visualization

ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build

FROM tiangolo/uwsgi-nginx-flask:python3.8

COPY requirements.txt /app
RUN pip install -r /app/requirements.txt

# NGINX should serve static content directly.
# https://github.com/tiangolo/uwsgi-nginx-flask-docker#custom-static-path
ENV STATIC_PATH /app/app/static

# Additional NGINX config that can't be handled with envvars.
# Be sure not to clobber nginx.conf from base image!
# Docs:   https://github.com/tiangolo/uwsgi-nginx-flask-docker#customizing-nginx-additional-configurations
# Source: https://github.com/tiangolo/uwsgi-nginx-docker/blob/c1e6eb2/docker-images/entrypoint.sh#L37
COPY portal.nginx.conf /etc/nginx/conf.d/

COPY --from=builder /work/app/static/public ${STATIC_PATH}/public
COPY . /app
