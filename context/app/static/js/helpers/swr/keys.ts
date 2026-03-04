/**
 * FNV-1a hash for a single string.
 * Returns a 32-bit unsigned integer.
 */
function fnv1a(str: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(hash ^ str.charCodeAt(i), 0x01000193);
  }
  return hash >>> 0;
}

/**
 * Computes a short, order-independent hash key for a collection of UUIDs.
 * Uses addition (commutative) over per-element FNV-1a hashes, avoiding
 * the need to sort the input and the O(N) memory cost of joining all UUIDs
 * into a single string.
 *
 * Collision probability is ~1 in 2^32 per comparison — negligible for
 * a UI cache with a handful of entries.
 */
export function hashUuidSet(uuids: Iterable<string>): string {
  let combined = 0;
  let count = 0;
  for (const uuid of uuids) {
    combined = (combined + fnv1a(uuid)) >>> 0;
    count++;
  }
  return `${count}:${combined.toString(36)}`;
}

/**
 * Computes a short hash key for an arbitrary string (e.g. a JSON body).
 */
export function hashString(str: string): string {
  return fnv1a(str).toString(36);
}
