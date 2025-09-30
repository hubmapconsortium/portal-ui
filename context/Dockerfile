# check=skip=InvalidDefaultArgInFrom
# Node and Python versions should always be specified in the build args.
ARG NODE_V
ARG PYTHON_MINOR_V 

FROM node:${NODE_V}-alpine AS frontend

WORKDIR /work
RUN apk add --no-cache git make g++

# COPY only what is needed so layers can be cached.
COPY package.json .
COPY package-lock.json .
COPY .npmrc .

ENV NODE_OPTIONS="--max-old-space-size=4096"

# Install dependencies with fallback strategy for SWC issues
RUN npm ci --prefer-offline --no-audit || \
  (echo "Initial npm ci failed, trying with ignored scripts..." && \
  npm cache clean --force && \
  npm_config_ignore_scripts=true npm ci --no-audit && \
  echo "Attempting to rebuild SWC core..." && \
  (npm rebuild @swc/core || echo "SWC rebuild failed, using fallback compilation"))

COPY tsconfig.json tsconfig.json
COPY .swcrc .swcrc
COPY build-utils build-utils
COPY app app
# portal-visualization is python-only, and not needed for the npm build.

RUN npm run build

FROM tiangolo/uwsgi-nginx-flask:python${PYTHON_MINOR_V} AS backend

COPY requirements.txt /app
# Legacy resolver is used to avoid issues with a non-pinned subdependency which causes build failures in CI
# https://github.com/hubmapconsortium/portal-ui/actions/runs/6087458665/job/16516023950
COPY constraints.txt /tmp
RUN PIP_CONSTRAINT=/tmp/constraints.txt pip install -r /app/requirements.txt --use-deprecated=legacy-resolver

# NGINX should serve static content directly.
# https://github.com/tiangolo/uwsgi-nginx-flask-docker#custom-static-path
ENV STATIC_PATH=/app/app/static

# Additional NGINX config that can't be handled with envvars.
# Be sure not to clobber nginx.conf from base image!
# Docs:   https://github.com/tiangolo/uwsgi-nginx-flask-docker#customizing-nginx-additional-configurations
# Source: https://github.com/tiangolo/uwsgi-nginx-docker/blob/c1e6eb2/docker-images/entrypoint.sh#L37
COPY portal.nginx.conf /etc/nginx/conf.d/

COPY --from=frontend /work/app/static/public ${STATIC_PATH}/public
COPY . /app
