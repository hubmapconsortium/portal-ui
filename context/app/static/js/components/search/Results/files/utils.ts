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
 * A collapsed hit: one representative document per dataset.
 *
 * The grouped documents are deliberately *not* requested via `inner_hits` -- that is what makes a
 * collapsed query cost seconds instead of milliseconds. Per-dataset counts and sizes come from
 * `useDatasetPageStats`, and the file list itself from `useDatasetFiles` when the modal opens.
 */
export type CollapsedDatasetHit = SearchHit<FileDocument>;

/**
 * Distinct organ labels for a dataset.
 *
 * `organs` is an array because a dataset can span several, and the same organ can repeat across
 * entries, so duplicates are collapsed.
 */
export function getOrganLabels(source?: FileDocument): string[] {
  return [...new Set((source?.organs ?? []).map((organ) => organ.label).filter(Boolean) as string[])];
}
