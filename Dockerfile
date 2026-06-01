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

# ---- Backend build stage --------------------------------------------------
# Docker Hardened Image, "-dev" variant: runs as root and includes a shell and
# package manager so we can build the venv here. Pulling dhi.io/* requires
# `docker login dhi.io`. Use a Debian/glibc 3.13 tag (NOT Alpine/musl) so the
# scientific wheels from portal-visualization[full] install cleanly; confirm the
# exact tag in the catalog (it may need a -debian13 suffix).
FROM dhi.io/python:${PYTHON_MINOR_V}-dev AS backend-build

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    VIRTUAL_ENV=/app/venv \
    PATH="/app/venv/bin:$PATH"

WORKDIR /app

# Build the venv the minimal runtime stage will copy.
RUN python -m venv /app/venv

# Install uv for fast dependency management, then install deps into the venv.
# Editable install so the `app` package resolves to /app/app and Flask's static
# folder is /app/app/static (a regular install would relocate it to
# site-packages and break the static path the built assets are copied to).
RUN pip install uv
COPY pyproject.toml uv.lock ./
COPY context/app ./app
RUN uv pip install --no-cache-dir -e .

# Bring in the rest of the app source (config, gunicorn.conf.py, templates, ...).
COPY context/ /app

# Built frontend assets. `.dockerignore` excludes context/app/static/public, so
# the COPY above never clobbers them; copied last to be unambiguous.
COPY --from=frontend /work/context/app/static/public ./app/static/public

# Strip dev-only artifacts: Vite uses `sourcemap: 'hidden'` (no sourceMappingURL
# in the .js), so deleting the .map files is clean; report.html only exists when
# built with ANALYZE.
RUN find /app/app/static/public -name '*.map' -delete \
  && rm -f /app/app/static/public/report.html

# Pre-compress static so WhiteNoise serves .br/.gz siblings (replaces nginx
# gzip_static; extends Vite's .gz to brotli + fonts/svg). Idempotent.
RUN python -m whitenoise.compress /app/app/static

# ---- Runtime stage --------------------------------------------------------
# Docker Hardened Image runtime variant: minimal, no shell or package manager,
# runs as a non-root user. No RUN steps are possible here (no shell) — all
# building happened above.
FROM dhi.io/python:${PYTHON_MINOR_V} AS backend

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    VIRTUAL_ENV=/app/venv \
    PATH="/app/venv/bin:$PATH"

WORKDIR /app

# Everything was assembled under /app in the build stage: the venv (with the
# editable link back to /app), the app source, the built + compressed static,
# and gunicorn.conf.py. World-readable perms suffice for the non-root user; the
# scfind cache writes to /tmp (writable), not /app.
COPY --from=backend-build /app /app

# Non-root runtime can't bind privileged ports; gunicorn listens on 8080 and the
# external gateway proxies to portal-ui:8080.
EXPOSE 8080

CMD ["gunicorn", "-c", "gunicorn.conf.py", "app.main:app"]
