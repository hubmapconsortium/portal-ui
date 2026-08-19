/**
 * Manifest text for the HuBMAP Command Line Transfer tool.
 *
 * One line per selection, `<HuBMAP ID> <path>`, where the path is relative to the dataset
 * directory. A whole-dataset selection uses `/`, which pulls everything in the dataset without the
 * caller having to enumerate its files -- necessary as well as convenient, since a single dataset
 * can hold hundreds of thousands of files.
 */

/** Path the CLT reads as "the whole dataset". */
export const WHOLE_DATASET_PATH = '/';

/** Every dataset carries one of these at its root; 4,971 of 4,972 in the index today. */
export const DATASET_METADATA_FILE = 'metadata.json';

export interface ManifestSelection {
  /** Datasets to include in full. */
  wholeDatasets: Set<string>;
  /** Individually chosen files, by dataset uuid. */
  selectedFiles?: Map<string, Set<string>>;
  /** HuBMAP ID per dataset uuid. A dataset with no known ID is skipped. */
  hubmapIdsByUuid: Map<string, string>;
  /**
   * Datasets that should additionally get a `metadata.json` line. Only meaningful for datasets
   * selected by file, since a whole-dataset line already covers it.
   */
  withMetadataJson?: Set<string>;
}

export function buildManifest({
  wholeDatasets,
  selectedFiles = new Map(),
  hubmapIdsByUuid,
  withMetadataJson,
}: ManifestSelection): string {
  const lines: string[] = [];

  // Sorted so the same selection always produces the same file, which makes the output diffable
  // and the tests deterministic.
  [...wholeDatasets].sort().forEach((datasetUuid) => {
    const hubmapId = hubmapIdsByUuid.get(datasetUuid);
    if (hubmapId) {
      lines.push(`${hubmapId} ${WHOLE_DATASET_PATH}`);
    }
  });

  [...selectedFiles.keys()].sort().forEach((datasetUuid) => {
    const hubmapId = hubmapIdsByUuid.get(datasetUuid);
    if (!hubmapId) {
      return;
    }
    const relPaths = new Set(selectedFiles.get(datasetUuid) ?? []);
    // Requested explicitly, so add it even though it was not among the matching files.
    if (withMetadataJson?.has(datasetUuid)) {
      relPaths.add(DATASET_METADATA_FILE);
    }
    [...relPaths].sort().forEach((relPath) => {
      lines.push(`${hubmapId} ${relPath}`);
    });
  });

  return lines.join('\n');
}

/**
 * Manifest for a plain list of whole datasets.
 *
 * Byte-identical to the `ids.join(' /\n') + ' /'` form this replaces.
 */
export function buildWholeDatasetManifest(hubmapIds: string[]): string {
  return hubmapIds.map((hubmapId) => `${hubmapId} ${WHOLE_DATASET_PATH}`).join('\n');
}
