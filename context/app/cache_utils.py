"""
Cross-process disk cache for expensive derived data.

Generalized from the scfind cell-type maps, which were the first consumer. A cache
is identified by a *namespace* (its own directory and config keys) plus a *name*
(the entry within it), so unrelated consumers can't collide.

Resolution order for a lookup is: in-process memo -> shared JSON file on disk ->
build it. The build is serialized with an exclusive ``fcntl.flock`` so that, even
when every gunicorn worker warms at startup simultaneously, only the first to
acquire the lock actually does the expensive work; the rest block briefly and then
load the file the winner wrote. Files are written atomically (temp + rename).
"""

from dataclasses import dataclass
import fcntl
import json
import os
import tempfile
import threading
import time

from flask import current_app


# In-process memo of built entries, keyed by (namespace, cache name). Guards against
# re-reading the shared file on every request within a worker. The shared file is what
# makes the expensive build happen once per deploy across all gunicorn worker processes.
_memory_cache = {}
_memory_lock = threading.Lock()


@dataclass(frozen=True)
class CacheNamespace:
    """
    Configuration for one family of cached entries.

    dir_name:    subdirectory of ``dir_config_key``'s value (or the system temp dir).
    dir_config_key: Flask config key holding an explicit cache directory, or None.
    ttl_config_key: Flask config key holding the max age in seconds. None/0 disables expiry.
    token_env_var:  environment variable whose value is mixed into the filename, so the
                    cache regenerates on each server start. Set by gunicorn's
                    ``on_starting`` hook in production; absent in development, where the
                    filename is stable and the TTL bounds staleness instead.
    version_config_key: optional Flask config key mixed into the filename, for caches whose
                    validity depends on an upstream version.
    """

    dir_name: str
    dir_config_key: str = None
    ttl_config_key: str = None
    token_env_var: str = None
    version_config_key: str = None


def cache_dir(namespace):
    """Directory backing a namespace's cache (created on demand).

    Defaults to a subdir of the system temp dir, which is writable by the non-root
    container user and ephemeral (so each deploy starts fresh).
    """
    configured = (
        current_app.config.get(namespace.dir_config_key) if namespace.dir_config_key else None
    )
    path = configured or os.path.join(tempfile.gettempdir(), namespace.dir_name)
    os.makedirs(path, exist_ok=True)
    return path


def cache_path(namespace, name):
    """Path to the JSON file for a given entry.

    Keyed by the namespace's version (when one is configured) and, in production, by a
    per-server-start token. The token makes the cache regenerate on each server start:
    all workers of one server share the same token (it's inherited at fork) and so share
    one freshly built file, while the next start gets a new token.
    """
    parts = [name]
    if namespace.version_config_key:
        parts.append(current_app.config.get(namespace.version_config_key) or 'latest')
    token = os.environ.get(namespace.token_env_var) if namespace.token_env_var else None
    if token:
        parts.append(token)
    safe = '.'.join(str(p).replace('/', '_').replace(os.sep, '_') for p in parts)
    return os.path.join(cache_dir(namespace), f'{safe}.json')


def _ttl(namespace):
    if not namespace.ttl_config_key:
        return None
    return current_app.config.get(namespace.ttl_config_key)


def _memo_key(namespace, name):
    return (namespace.dir_name, name)


def get_or_build(namespace, name, builder):
    """
    Return a cached entry, building it at most once across all worker processes.

    A disk file older than the namespace's TTL is treated as stale and rebuilt. This is
    what bounds staleness in development (the per-start token handles production).
    """
    memo_key = _memo_key(namespace, name)
    with _memory_lock:
        if memo_key in _memory_cache:
            return _memory_cache[memo_key]

    path = cache_path(namespace, name)
    ttl = _ttl(namespace)
    lock_path = f'{path}.lock'
    with open(lock_path, 'w') as lock_file:
        fcntl.flock(lock_file, fcntl.LOCK_EX)
        try:
            fresh = os.path.exists(path)
            if fresh and ttl and (time.time() - os.path.getmtime(path)) > ttl:
                fresh = False  # aged out -> rebuild
            if fresh:
                with open(path) as data_file:
                    data = json.load(data_file)
                current_app.logger.info("Loaded '%s' from shared cache %s.", name, path)
            else:
                start = time.monotonic()
                data = builder()
                tmp_path = f'{path}.{os.getpid()}.tmp'
                with open(tmp_path, 'w') as tmp_file:
                    json.dump(data, tmp_file)
                os.replace(tmp_path, path)
                current_app.logger.info(
                    "Built '%s' in %.1fs; cached to %s.",
                    name,
                    time.monotonic() - start,
                    path,
                )
        finally:
            fcntl.flock(lock_file, fcntl.LOCK_UN)

    with _memory_lock:
        _memory_cache[memo_key] = data
    return data


def load_cached(namespace, name):
    """
    Return an already-built entry from the in-process memo or the shared disk cache,
    WITHOUT building it — returns ``None`` if it hasn't been built yet.

    For latency-sensitive paths (e.g. server-rendering a page) that want the warmed data
    when it's available but must never trigger the expensive build.
    """
    memo_key = _memo_key(namespace, name)
    with _memory_lock:
        if memo_key in _memory_cache:
            return _memory_cache[memo_key]
    path = cache_path(namespace, name)
    ttl = _ttl(namespace)
    if not os.path.exists(path):
        return None
    if ttl and (time.time() - os.path.getmtime(path)) > ttl:
        return None
    try:
        with open(path) as data_file:
            data = json.load(data_file)
    except (OSError, ValueError):
        return None
    with _memory_lock:
        _memory_cache[memo_key] = data
    return data


def clear_memory_cache():
    """Drop the in-process memo. For tests; the disk cache is unaffected."""
    with _memory_lock:
        _memory_cache.clear()


def prune(namespace, max_entries):
    """
    Keep at most ``max_entries`` JSON files in a namespace's directory, deleting the
    least-recently-modified first.

    For namespaces whose key space is driven by user input (so unbounded), this keeps
    disk use predictable. Entries still in a worker's in-process memo are unaffected by
    deletion; they simply stop being shared with other workers.
    """
    if not max_entries:
        return
    directory = cache_dir(namespace)
    try:
        entries = [
            os.path.join(directory, name)
            for name in os.listdir(directory)
            if name.endswith('.json')
        ]
    except OSError:
        return
    if len(entries) <= max_entries:
        return
    # Oldest first; drop everything past the limit.
    try:
        entries.sort(key=os.path.getmtime)
    except OSError:
        return
    for path in entries[: len(entries) - max_entries]:
        try:
            os.remove(path)
        except OSError:
            pass
