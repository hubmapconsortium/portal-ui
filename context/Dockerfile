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

# COPY only what is needed so layers can be cached.
COPY package.json .
COPY package-lock.json .
COPY .npmrc .

RUN npm ci

COPY tsconfig.json tsconfig.json
COPY .swcrc .swcrc
COPY build-utils build-utils
COPY app app
# portal-visualization is python-only, and not needed for the npm build.

RUN npm run build

FROM tiangolo/uwsgi-nginx-flask:python${PYTHON_MINOR_V} AS backend

# Install uv for faster dependency management
RUN pip install uv

# Copy project configuration to /app (where the base image expects the app)
WORKDIR /app
COPY pyproject.toml .
COPY uv.lock .
COPY app ./app

# Install dependencies using uv into system Python
RUN uv pip install --system --no-cache-dir -e .

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
