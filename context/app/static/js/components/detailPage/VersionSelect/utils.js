export function getCleanVersion(version) {
  return Object.fromEntries(Object.entries(version).map(([k, v]) => [k.endsWith('_uuid') ? 'uuid' : k, v]));
}

export function getCleanVersions(versions) {
  return versions.map((version) => getCleanVersion(version));
}
