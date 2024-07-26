/**
 * Formats the URL for fetching provenance data
 * @param uuid the UUID of the entity
 * @param entityEndpoint the base URL of the entities API endpoint
 * @returns the URL for fetching provenance data
 */
export function createProvDataURL(uuid: string, entityEndpoint: string) {
  return `${entityEndpoint}/entities/${uuid}/provenance`;
}

/**
 * Combines ProvData objects without overwriting properties or inserting unnecessary duplicates.
 * @param a the first ProvData object
 * @param b the second ProvData object
 * @param keyMod the string to append to the key of a property in b if it already exists in a
 */
export function nonDestructiveMerge<T extends Record<string, unknown>, U extends Record<string, unknown>>(
  a: T,
  b: U,
  keyMod: string,
): T {
  const merged = { ...a } as Record<string, unknown>;
  Object.entries(b).forEach(([key, value]) => {
    if (merged[key]) {
      // Confirm that properties are actually different
      if (JSON.stringify(merged[key]) === JSON.stringify(value)) {
        return;
      }
      merged[`${key}-${keyMod}`] = value;
    } else {
      merged[key] = value;
    }
  });
  return merged as T;
}
