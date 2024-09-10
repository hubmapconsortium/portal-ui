/**
 * Formats the URL for fetching provenance data
 * @param uuid the UUID of the entity
 * @param entityEndpoint the base URL of the entities API endpoint
 * @returns the URL for fetching provenance data
 */
export function createProvDataURL(uuid: string, entityEndpoint: string) {
  return `${entityEndpoint}/entities/${uuid}/provenance`;
}

function findDifference<T extends Record<string, unknown>, U extends Record<string, unknown>>(obj1: T, obj2: U) {
  const diffKeys = Object.keys({ ...obj1, ...obj2 }).reduce((acc, key) => {
    if (key in obj1 && key in obj2 && obj1[key] === obj2[key]) {
      return acc;
    }
    return [...acc, key];
  }, [] as string[]);
  return diffKeys;
}

const ignoredFields = ['hubmap:last_modified_timestamp', 'hubmap:published_timestamp', 'hubmap:created_timestamp'];

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
    // Check for duplicate provenance edges by comparing entity and activity IDs
    if (value && typeof value === 'object' && 'prov:entity' in value && 'prov:activity' in value) {
      if (
        Object.values(merged).some(
          (v) =>
            typeof v === 'object' &&
            v &&
            'prov:entity' in v &&
            'prov:activity' in v &&
            v['prov:entity'] === value['prov:entity'] &&
            v['prov:activity'] === value['prov:activity'],
        )
      ) {
        return;
      }
    }

    if (merged[key]) {
      // Heuristic to check if the objects are the same
      if (JSON.stringify(merged[key]) === JSON.stringify(value)) {
        return;
      }

      if (merged[key] && typeof merged[key] === 'object' && value && typeof value === 'object') {
        // Perform a more in-depth check to see if objects are the same when excluding certain fields
        const difference = findDifference(
          merged[key] as Record<string, unknown>,
          value as Record<string, unknown>,
        ).filter((diffField) => !ignoredFields.includes(diffField));

        if (difference.length === 0) {
          return;
        }
      }

      merged[`${key}-${keyMod}`] = value;
    } else {
      merged[key] = value;
    }
  });
  return merged as T;
}
