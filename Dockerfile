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

# Enable pnpm via corepack. The version is pinned via package.json#packageManager.
RUN corepack enable && corepack prepare pnpm@10.27.0 --activate

# COPY only what is needed so layers can be cached.
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc ./
COPY context/package.json context/package.json
COPY end-to-end/package.json end-to-end/package.json

# Install only context's deps (skip the cypress binary download from end-to-end).
RUN pnpm install --frozen-lockfile --filter ./context...

COPY context/tsconfig.json context/tsconfig.json
COPY context/vite.config.mts context/vite.config.maintenance.mts context/
COPY context/app context/app
# portal-visualization is python-only, and not needed for the frontend build.

RUN pnpm --filter ./context run build

FROM tiangolo/uwsgi-nginx-flask:python${PYTHON_MINOR_V} AS backend

# Install uv for faster dependency management
RUN pip install uv

# Copy project configuration to /app (where the base image expects the app)
WORKDIR /app
COPY pyproject.toml .
COPY uv.lock .
COPY context/app ./app

# Install dependencies using uv into system Python
RUN uv pip install --system --no-cache-dir -e .

# NGINX should serve static content directly.
# https://github.com/tiangolo/uwsgi-nginx-flask-docker#custom-static-path
ENV STATIC_PATH=/app/app/static

# Additional NGINX config that can't be handled with envvars.
# Be sure not to clobber nginx.conf from base image!
# Docs:   https://github.com/tiangolo/uwsgi-nginx-flask-docker#customizing-nginx-additional-configurations
# Source: https://github.com/tiangolo/uwsgi-nginx-docker/blob/c1e6eb2/docker-images/entrypoint.sh#L37
COPY context/portal.nginx.conf /etc/nginx/conf.d/

COPY --from=frontend /work/context/app/static/public ${STATIC_PATH}/public
COPY context/ /app
