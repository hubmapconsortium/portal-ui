import { SearchHit } from 'js/typings/elasticsearch';

/** A document in the `files` index. Fields describe the file and the dataset containing it. */
export interface FileDocument {
  dataset_uuid: string;
  dataset_hubmap_id: string;
  rel_path: string;
  file_extension?: string;
  size?: number;
  description?: string;
  file_uuid?: string;
  dataset_type?: string;
  data_class?: string;
  dataset_status?: string;
  data_access_level?: string;
  analyte_class?: string;
  organs?: { code?: string; hierarchy?: string; label?: string; uuid?: string }[];
}

/**
 * A collapsed hit: one dataset, with the files matching the query under `inner_hits`.
 *
 * `inner_hits` is already declared on `SearchHit`, but its documents are untyped there, so
 * the sources are narrowed on read rather than by redeclaring the field.
 */
export type CollapsedDatasetHit = SearchHit<FileDocument>;

export function getInnerFiles(hit: CollapsedDatasetHit, innerHitsName: string): FileDocument[] {
  const hits = hit.inner_hits?.[innerHitsName]?.hits?.hits ?? [];
  return hits
    .map((inner) => inner._source as FileDocument | undefined)
    .filter((source): source is FileDocument => Boolean(source));
}

/**
 * Total files in this dataset matching the query, which is generally more than `inner_hits`
 * returned -- that is capped at the configured inner-hits size.
 */
export function getInnerFileCount(hit: CollapsedDatasetHit, innerHitsName: string): number {
  const total = hit.inner_hits?.[innerHitsName]?.hits?.total;
  if (typeof total === 'number') {
    return total;
  }
  return total?.value ?? 0;
}

/**
 * Distinct organ labels for a dataset.
 *
 * `organs` is an array because a dataset can span several, and the same organ can repeat
 * across entries, so duplicates are collapsed.
 */
export function getOrganLabels(source?: FileDocument): string[] {
  return [...new Set((source?.organs ?? []).map((organ) => organ.label).filter(Boolean) as string[])];
}

/** Distinct file extensions among a row's files, for the file-type column. */
export function getFileTypes(files: FileDocument[]): string[] {
  return [...new Set(files.map((file) => file.file_extension).filter(Boolean) as string[])].sort();
}

export function sumFileSizes(files: FileDocument[]): number {
  return files.reduce((total, file) => total + (file.size ?? 0), 0);
}

/**
 * One manifest line per selection, in the format the HuBMAP CLT reads:
 * `<HuBMAP ID> <path>`, where the path is relative to the dataset directory.
 *
 * A whole-dataset selection emits `<HuBMAP ID> /`, matching what the existing dataset bulk
 * download produces -- so the CLT fetches everything in the dataset without the caller having
 * to enumerate its files.
 */
export function buildManifest({
  wholeDatasets,
  selectedFiles,
  hubmapIdsByUuid,
}: {
  wholeDatasets: Set<string>;
  selectedFiles: Map<string, Set<string>>;
  hubmapIdsByUuid: Map<string, string>;
}): string {
  const lines: string[] = [];

  // Sorted so the same selection always produces the same file, which makes the output
  // diffable and the tests deterministic.
  const sortedWhole = [...wholeDatasets].sort();
  for (const datasetUuid of sortedWhole) {
    const hubmapId = hubmapIdsByUuid.get(datasetUuid);
    if (hubmapId) {
      lines.push(`${hubmapId} /`);
    }
  }

  const sortedPartial = [...selectedFiles.keys()].sort();
  for (const datasetUuid of sortedPartial) {
    const hubmapId = hubmapIdsByUuid.get(datasetUuid);
    if (!hubmapId) {
      continue;
    }
    for (const relPath of [...(selectedFiles.get(datasetUuid) ?? [])].sort()) {
      lines.push(`${hubmapId} ${relPath}`);
    }
  }

  return lines.join('\n');
}
