import LZString from 'lz-string';

import { isObject } from 'js/helpers/type-guards';

/**
 * Auth-token handling for shared Vitessce configurations.
 *
 * Configs can carry the viewer's groups token in two shapes, at arbitrary depth and under several
 * key names: a `?token=` query param on asset URLs (viv's image tile requests can't carry headers)
 * and `requestInit.headers.Authorization`. Both are short-lived, so a config shared verbatim stops
 * working as soon as the sharer's token expires — and leaks a live credential into browser history,
 * email bodies and chat logs on the way.
 *
 * So: preserve the shape of the auth material, replace only the secret. Exports swap the token for
 * a placeholder; opening a shared link swaps in the viewer's own token, or removes the credential
 * entirely when there is no viewer token to substitute.
 */

/**
 * Stands in for the sharer's groups token in an exported config. Restricted to `[A-Z_]` so it needs
 * neither JSON nor URL escaping, and deliberately not token-shaped so that an unrestored config
 * fails closed rather than silently half-working.
 */
export const SHARED_TOKEN_PLACEHOLDER = 'HUBMAP_SHARED_TOKEN_PLACEHOLDER';

const PLACEHOLDER_PARAM = `token=${SHARED_TOKEN_PLACEHOLDER}`;

/** Escape a value for splicing into an already-serialized JSON string. */
function jsonEscape(value: string) {
  return JSON.stringify(value).slice(1, -1);
}

/**
 * Whether a config carries any credential at all. Gates the expiry warning on raw-config exports,
 * and is intentionally broader than "contains the current viewer's token" so that a config whose
 * token came from somewhere else — a link shared before placeholders existed, say — still warns.
 */
export function containsCredentials(conf: unknown): boolean {
  if (conf == null) {
    return false;
  }
  const serialized = JSON.stringify(conf);
  return serialized.includes('token=') || serialized.includes('"Authorization"');
}

/**
 * Swap the sharer's groups token for the placeholder, everywhere it appears and whatever the key is
 * called. Published datasets are built without tokens, so their configs come through unchanged —
 * as does any config that simply doesn't mention the token, which is returned by reference.
 */
export function replaceTokenWithPlaceholder<T>(conf: T, groupsToken: string): T {
  // Bail on an empty token: `replaceAll('', x)` would splice the placeholder between every character.
  if (conf == null || !groupsToken) {
    return conf;
  }
  const needle = jsonEscape(groupsToken);
  const serialized = JSON.stringify(conf);
  if (!serialized.includes(needle)) {
    return conf;
  }
  return JSON.parse(serialized.replaceAll(needle, SHARED_TOKEN_PLACEHOLDER)) as T;
}

/**
 * Undo {@link replaceTokenWithPlaceholder} for the *current* viewer: splice in their token, or, for
 * a viewer with no token, remove the auth material so public assets are still fetched
 * unauthenticated. A config with no placeholder — a server-built conf, a static CDN conf, or a link
 * shared before this existed — is returned untouched, by reference.
 */
export function restoreTokenFromPlaceholder<T>(conf: T, groupsToken: string): T {
  if (conf == null) {
    return conf;
  }
  const serialized = JSON.stringify(conf);
  if (!serialized.includes(SHARED_TOKEN_PLACEHOLDER)) {
    return conf;
  }
  if (groupsToken) {
    return JSON.parse(serialized.replaceAll(SHARED_TOKEN_PLACEHOLDER, jsonEscape(groupsToken))) as T;
  }
  return stripPlaceholder(conf) as T;
}

/**
 * Whether a URL fragment carries a shared config that references non-public data — i.e. one this
 * viewer needs credentials for. Callers pair it with an empty `groupsToken` to decide whether to
 * prompt for login.
 *
 * Deliberately decodes with lz-string rather than vitessce's `decodeURLParamsToConf`, and only
 * substring-matches instead of parsing: this runs on the detail page's alert band, which must not
 * pull the (lazy-loaded, very large) vitessce bundle into the initial page chunk. The fragment
 * shape comes from `encodeConfInUrl`:
 * `vitessce_conf_length=<n>&vitessce_conf_version=<v>&vitessce_conf=<lz-string>`.
 */
export function sharedConfNeedsCredentials(hash: string): boolean {
  const fragment = hash.startsWith('#') ? hash.slice(1) : hash;
  if (!fragment.startsWith('vitessce_conf_')) {
    return false;
  }
  const compressed = new URLSearchParams(fragment).get('vitessce_conf');
  if (!compressed) {
    return false;
  }
  // Malformed input decompresses to null or throws, depending on how it's malformed.
  try {
    return Boolean(LZString.decompressFromEncodedURIComponent(compressed)?.includes(SHARED_TOKEN_PLACEHOLDER));
  } catch {
    return false;
  }
}

function stripPlaceholderFromString(value: string) {
  if (!value.includes(SHARED_TOKEN_PLACEHOLDER)) {
    return value;
  }
  return (
    value
      // `replaceAll` with a string pattern is literal, so `?` needs no escaping. Order matters:
      // consume an adjacent separator so the remaining query string stays well-formed.
      .replaceAll(`&${PLACEHOLDER_PARAM}`, '') // not the first param
      .replaceAll(`?${PLACEHOLDER_PARAM}&`, '?') // first of several
      .replaceAll(`?${PLACEHOLDER_PARAM}`, '') // the only param
      // Safety net: a placeholder somewhere we don't model gets blanked rather than left behind to
      // masquerade as a credential.
      .replaceAll(SHARED_TOKEN_PLACEHOLDER, '')
  );
}

function stripPlaceholder(value: unknown): unknown {
  if (typeof value === 'string') {
    return stripPlaceholderFromString(value);
  }
  // `map`, never `filter`: Vitessce coordinates datasets/views/files by array index.
  if (Array.isArray(value)) {
    return value.map(stripPlaceholder);
  }
  if (!isObject(value)) {
    return value;
  }

  const result: Record<string, unknown> = {};
  Object.entries(value).forEach(([key, child]) => {
    // Drop the auth header outright rather than sending `Bearer ` — an empty bearer buys nothing
    // and costs a CORS preflight.
    if (
      key.toLowerCase() === 'authorization' &&
      typeof child === 'string' &&
      child.includes(SHARED_TOKEN_PLACEHOLDER)
    ) {
      return;
    }
    const stripped = stripPlaceholder(child);
    // Prune a container that existed only to carry the credential — `headers` first, then
    // `requestInit` on the way back up. Keyed on "was non-empty, is now empty" rather than a key
    // allow-list, so objects that were empty to begin with survive and a snake_case `request_init`
    // needs no special case.
    if (isObject(child) && isObject(stripped) && Object.keys(child).length > 0 && Object.keys(stripped).length === 0) {
      return;
    }
    result[key] = stripped;
  });
  return result;
}
