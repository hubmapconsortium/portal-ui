const FNV_PRIME = 0x01000193;
const FNV_OFFSET_BASIS = 0x811c9dc5;

/**
 * FNV-1a hash for a single string.
 * Formal definition: https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function
 * Another explanation: https://compile7.org/hashing/how-to-use-fnv-1-in-javascript-in-browser/#encoding-strings-with-fnv-1-in-javascript
 *
 * Initializes a hash value to a fixed offset basis, then iterates over each byte of the input string,
 * XORs it with the hash, and multiplies the result by a prime number. The final hash is a 32-bit unsigned integer.
 */
function fnv1a(str: string): number {
  let hash = FNV_OFFSET_BASIS;
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(hash ^ str.charCodeAt(i), FNV_PRIME);
  }
  // >>> 0 converts to unsigned 32-bit integer, ensuring a non-negative result and consistent hashing across platforms.
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
