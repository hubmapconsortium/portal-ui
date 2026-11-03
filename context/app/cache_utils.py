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


# In-process memo of built entries, keyed by (namespace, cache name), holding
# (expires_at, data). Guards against re-reading the shared file on every request within a
# worker. The shared file is what makes the expensive build happen once per deploy across
# all gunicorn worker processes. Unless the namespace opts out, entries expire with its TTL,
# measured from when the data was built, so the memo never serves data the disk cache would
# treat as stale.
_memory_cache = {}
_memory_lock = threading.Lock()
_MISSING = object()

# How long a degraded result is served from the memo before the next request tries a full build.
DEGRADED_RETRY_SECONDS = 300


class Degraded(Exception):
    """
    Raised by a builder whose result is usable but incomplete (some upstream calls failed).

    ``get_or_build`` serves ``data`` but never writes it to the entry's file. It shares it with
    the other workers through a ``.degraded`` sibling file, for only ``DEGRADED_RETRY_SECONDS``,
    so a partial result neither outlives the outage nor turns into one rebuild per request (or
    per worker waiting on the lock).
    """

    def __init__(self, data):
        super().__init__('degraded build')
        self.data = data


class BuildFailed(Exception):
    """
    Raised to a request that queued on an entry's lock behind a build that then failed.

    Queued requests share that attempt's outcome instead of each repeating it in turn: against a
    stalled upstream, one retry per waiter keeps every queued request (and its server thread)
    waiting one more timeout each. A request that arrives after the failure still builds afresh,
    so the failure itself is never cached.
    """


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
    expire_memo:    whether the in-process memo also expires with the TTL. Opt out when a
                    rebuild is too slow to run inside a request; the entry then lives until
                    the worker restarts.
    """

    dir_name: str
    dir_config_key: str = None
    ttl_config_key: str = None
    token_env_var: str = None
    version_config_key: str = None
    expire_memo: bool = True


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


def _memo_get(memo_key):
    with _memory_lock:
        entry = _memory_cache.get(memo_key)
        if entry is None:
            return _MISSING
        expires_at, data = entry
        if time.time() > expires_at:
            del _memory_cache[memo_key]
            return _MISSING
        return data


def _memo_set(namespace, memo_key, data, built_at=None, expires_at=None):
    if expires_at is None:
        ttl = _ttl(namespace) if namespace.expire_memo else None
        expires_at = built_at + ttl if ttl else float('inf')
    now = time.time()
    with _memory_lock:
        # Sweep on insert, so entries whose keys are never asked for again (one per distinct
        # facet query, say) don't pile up for the life of the worker.
        for key in [key for key, (expiry, _) in _memory_cache.items() if expiry < now]:
            del _memory_cache[key]
        _memory_cache[memo_key] = (expires_at, data)


def _write_json(path, data):
    """Write ``data`` to ``path`` atomically (temp file + rename), so readers never see half."""
    tmp_path = f'{path}.{os.getpid()}.{threading.get_ident()}.tmp'
    with open(tmp_path, 'w') as tmp_file:
        json.dump(data, tmp_file)
    os.replace(tmp_path, path)


def _mtime(path):
    try:
        return os.path.getmtime(path)
    except OSError:
        return 0


def _load_recent_degraded(degraded_path):
    """Return ``(data, expires_at)`` for a degraded file still in its retry window, else None."""
    try:
        expires_at = os.path.getmtime(degraded_path) + DEGRADED_RETRY_SECONDS
        if time.time() > expires_at:
            return None
        with open(degraded_path) as data_file:
            return json.load(data_file), expires_at
    except (OSError, ValueError):
        return None


def get_or_build(namespace, name, builder):
    """
    Return a cached entry, building it at most once across all worker processes.

    A disk file older than the namespace's TTL is treated as stale and rebuilt. This is
    what bounds staleness in development (the per-start token handles production).
    """
    memo_key = _memo_key(namespace, name)
    data = _memo_get(memo_key)
    if data is not _MISSING:
        return data

    path = cache_path(namespace, name)
    degraded_path = f'{path}.degraded'
    failed_path = f'{path}.failed'
    ttl = _ttl(namespace)
    lock_path = f'{path}.lock'
    waiting_since = time.time()
    with open(lock_path, 'w') as lock_file:
        fcntl.flock(lock_file, fcntl.LOCK_EX)
        try:
            fresh = os.path.exists(path)
            if fresh and ttl and (time.time() - os.path.getmtime(path)) > ttl:
                fresh = False  # aged out -> rebuild
            recent_degraded = None if fresh else _load_recent_degraded(degraded_path)
            if fresh:
                built_at = os.path.getmtime(path)
                with open(path) as data_file:
                    data = json.load(data_file)
                current_app.logger.info("Loaded '%s' from shared cache %s.", name, path)
            elif recent_degraded:
                # Another worker just built this with missing parts. Serve its result rather than
                # repeating a build that would most likely hit the same upstream failures.
                data, expires_at = recent_degraded
                _memo_set(namespace, memo_key, data, expires_at=expires_at)
                return data
            elif _mtime(failed_path) >= waiting_since:
                raise BuildFailed(f"'{name}' failed to build while this request waited for it")
            else:
                start = time.monotonic()
                built_at = time.time()
                try:
                    data = builder()
                except Degraded as degraded:
                    current_app.logger.warning(
                        "Built '%s' with missing parts; sharing it for %ss only.",
                        name,
                        DEGRADED_RETRY_SECONDS,
                    )
                    _write_json(degraded_path, degraded.data)
                    _memo_set(
                        namespace,
                        memo_key,
                        degraded.data,
                        expires_at=time.time() + DEGRADED_RETRY_SECONDS,
                    )
                    return degraded.data
                except Exception:
                    # Mark the failure for the requests queued on the lock (see BuildFailed).
                    open(failed_path, 'a').close()
                    os.utime(failed_path)
                    raise
                _write_json(path, data)
                current_app.logger.info(
                    "Built '%s' in %.1fs; cached to %s.",
                    name,
                    time.monotonic() - start,
                    path,
                )
        finally:
            fcntl.flock(lock_file, fcntl.LOCK_UN)

    _memo_set(namespace, memo_key, data, built_at)
    return data


def load_cached(namespace, name):
    """
    Return an already-built entry from the in-process memo or the shared disk cache,
    WITHOUT building it — returns ``None`` if it hasn't been built yet.

    For latency-sensitive paths (e.g. server-rendering a page) that want the warmed data
    when it's available but must never trigger the expensive build.
    """
    memo_key = _memo_key(namespace, name)
    data = _memo_get(memo_key)
    if data is not _MISSING:
        return data
    path = cache_path(namespace, name)
    ttl = _ttl(namespace)
    try:
        built_at = os.path.getmtime(path)
        if ttl and (time.time() - built_at) > ttl:
            return None
        with open(path) as data_file:
            data = json.load(data_file)
    except (OSError, ValueError):
        return None
    _memo_set(namespace, memo_key, data, built_at)
    return data


def store(namespace, name, data):
    """
    Publish an entry fetched outside ``get_or_build``, for ``load_cached`` readers in any worker.

    Takes no lock: for a cheap lookup, two workers racing to fetch it just write the same data
    twice, whereas a lock would queue every request behind one stalled upstream call.
    """
    _write_json(cache_path(namespace, name), data)
    _memo_set(namespace, _memo_key(namespace, name), data, time.time())


def is_persisted(namespace, name):
    """
    Whether an entry's last build was complete, i.e. written to disk rather than Degraded.

    Compares against the ``.degraded`` sibling, since a complete file from an earlier build can
    outlive its TTL next to a newer degraded one.
    """
    path = cache_path(namespace, name)
    try:
        built_at = os.path.getmtime(path)
    except OSError:
        return False
    try:
        return built_at >= os.path.getmtime(f'{path}.degraded')
    except OSError:
        return True


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
    deletion; they simply stop being shared with other workers, and leave the memo when
    their TTL runs out.
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
