import { Version } from './types';

export function getCleanVersion(version: object) {
  return Object.fromEntries(
    Object.entries(version).map(([k, v]) => [k.endsWith('_uuid') ? 'uuid' : k, v]),
  ) as unknown as Version;
}

export function getCleanVersions(versions: object[]) {
  return versions.map((version) => getCleanVersion(version));
}
