/**
 * Builds a URL to an asset on the portal CDN (`CDN_URL`, a build-time global).
 *
 * Portal assets are namespaced by a version prefix; `v3` is the current generation (the assets
 * uploaded for the current homepage). Pass a path relative to that prefix so the `v3/`
 * requirement lives in one place instead of being repeated — and easily missed — at every call
 * site. Interpolated paths are fine, e.g. `cdnUrl(`thumbnail_${name}-25.webp`)`.
 *
 * Not for the older `v2/` icon assets or the un-versioned root (e.g. `maintenance-message.md`),
 * which reference the CDN directly.
 *
 * @example cdnUrl('workspaces.webm') // `${CDN_URL}/v3/workspaces.webm`
 */
export function cdnUrl(path: string): string {
  return `${CDN_URL}/v3/${path}`;
}
