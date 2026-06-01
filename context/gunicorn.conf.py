"""Gunicorn configuration for the HuBMAP Data Portal.

Replaces the uWSGI + nginx + supervisor stack the deprecated
``tiangolo/uwsgi-nginx-flask`` base image bundled. Static assets are served by
WhiteNoise from within the WSGI app (see ``app/main.py``); gunicorn just runs
the Flask app. Gunicorn runs native CPython threads, so the per-request
``ThreadPoolExecutor`` and the scfind cache-warmer thread work without the uWSGI
``enable-threads`` flag.
"""

import multiprocessing
import os

# The Docker Hardened Image runtime runs as a non-root user, which cannot bind
# privileged ports (<1024). The external gateway proxies to this port.
bind = '0.0.0.0:8080'

# Threaded workers: the app is I/O-bound (lots of upstream HTTP to search-api,
# scfind, UBKG, workspaces), uses its own ThreadPoolExecutor, and has async
# (Flask[async]) views. gevent/eventlet monkey-patching would conflict with
# those patterns, so use gthread.
worker_class = 'gthread'
workers = int(os.environ.get('WEB_CONCURRENCY', multiprocessing.cpu_count() * 2 + 1))
threads = int(os.environ.get('GUNICORN_THREADS', 8))

# A request arriving while the scfind maps are still being built blocks on the
# shared-cache lock until the build finishes (~25-44s cold). Keep the worker
# timeout well above that. NOTE: the external gateway's proxy_read_timeout is
# the real client-facing ceiling and must be at least as high.
timeout = int(os.environ.get('GUNICORN_TIMEOUT', 120))
graceful_timeout = 30
keepalive = 5

# Each worker imports the app and runs its own scfind cache-warmer; the
# cross-process disk cache (app/routes_scfind.py) ensures the scfind build
# happens only once across workers, so we don't need --preload.
preload_app = False

# The container is only reachable via the trusted gateway/sidecar; ProxyFix in
# the app handles the X-Forwarded-* headers it relies on for URL building.
forwarded_allow_ips = '*'

# Log to stdout/stderr so the awslogs driver (prod) captures everything.
accesslog = '-'
errorlog = '-'
loglevel = os.environ.get('GUNICORN_LOG_LEVEL', 'info')


def on_starting(server):
    """Print the configured service ENDPOINTs at boot.

    Reproduces the old ``prestart.sh`` diagnostic dump. Runs once in the master
    before workers fork. Pure Python so it works in the shell-less DHI runtime.
    """
    try:
        with open('/app/instance/app.conf') as conf:
            for line in conf:
                stripped = line.strip()
                if 'ENDPOINT' in stripped and not stripped.startswith('#'):
                    server.log.info(stripped)
    except FileNotFoundError:
        server.log.warning('app.conf not found at /app/instance/app.conf at startup')
