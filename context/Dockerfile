# check=skip=InvalidDefaultArgInFrom
# Node and Python versions should always be specified in the build args.
ARG NODE_V
ARG PYTHON_MINOR_V 

FROM node:${NODE_V}-alpine AS frontend

WORKDIR /work

# Install system dependencies and increase virtual memory
RUN apk add --no-cache git make g++ python3 \
  && echo 'vm.max_map_count=262144' >> /etc/sysctl.conf

# Set memory optimization environment variables
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV NPM_CONFIG_PROGRESS=false
ENV NPM_CONFIG_LOGLEVEL=warn
ENV DISABLE_OPENCOLLECTIVE=1

# COPY only what is needed so layers can be cached.
COPY package.json .
COPY package-lock.json .
COPY .npmrc .

# Multi-stage npm install with specific handling for SWC
# First, try normal installation
RUN npm ci --no-audit --no-fund --prefer-offline --ignore-scripts && npm rebuild @swc/core || \
  # If that fails, clean cache and try again with scripts enabled
  (npm cache clean --force && \
  npm ci --no-audit --no-fund --prefer-offline || \
  # If still failing, install everything except SWC, then install SWC separately
  (npm install --ignore-scripts --no-audit --no-fund && \
  npm install @swc/core --no-save --ignore-scripts))

COPY tsconfig.json tsconfig.json
COPY .swcrc .swcrc
COPY build-utils build-utils
COPY app app
# portal-visualization is python-only, and not needed for the npm build.

RUN npm run build

FROM tiangolo/uwsgi-nginx-flask:python${PYTHON_MINOR_V} AS backend

# Use a constraints file to force pip to use correct versions of numpy/pandas/frozenlist that are compatible with python 3.12.
COPY requirements.txt /app
# Legacy resolver is used to avoid issues with a non-pinned subdependency which causes build failures in CI
# https://github.com/hubmapconsortium/portal-ui/actions/runs/6087458665/job/16516023950
COPY constraints.txt /tmp
RUN PIP_CONSTRAINT=/tmp/constraints.txt pip install -r /app/requirements.txt

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
