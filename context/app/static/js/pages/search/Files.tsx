import React from 'react';

import Search from 'js/components/search';
import { FACETS } from 'js/components/search/store';
import { useAppContext } from 'js/components/Contexts';

/**
 * Search over the `files` index: one row per dataset, expandable to its matching files.
 *
 * Unlike the entity searches this reads a different index, which shapes the config in ways
 * worth stating up front:
 *
 * - It has no `all_text` field, so free text is matched against named fields.
 * - Its path field is analyzed into whole path segments, so free text cannot find a filename
 *   *fragment* ("secondary" does not match `secondary_analysis.h5ad`). That is what the separate
 *   `filenameFilter` is for; see `FilenameFilterBar`.
 * - It has no `uuid` field, so the `search_after` tiebreaker is overridden. Sorting on an
 *   unmapped field is a hard Elasticsearch error.
 * - Its HuBMAP ID and UUID fields describe the *dataset* a file belongs to, so ID lookups are
 *   pointed at those. An unmapped field in a query matches nothing silently.
 * - It has no `next_revision_uuid` / `sub_status`, so there is no revision filtering (and
 *   hence no "include superseded" control, which is only rendered beside `mapped_status`).
 * - Facets come from a cached Flask endpoint rather than riding along with the hits; see
 *   `useFacetAggregations` for why.
 */
const filesFacetGroups = {
  File: [
    // `isFilterable` adds a text box over the facet's own values. The index has 74 distinct
    // extensions, well past what a "View More" list makes browsable, and file type is one of the
    // two things people search by.
    {
      field: 'file_extension',
      type: FACETS.term,
      order: { type: '_count', dir: 'desc' } as const,
      isFilterable: true,
    },
    { field: 'is_qa_qc', type: FACETS.term },
    { field: 'is_data_product', type: FACETS.term },
  ],
  Dataset: [
    {
      field: 'dataset_type',
      type: FACETS.term,
      order: { type: '_term', dir: 'asc' } as const,
      isFilterable: true,
    },
    { field: 'data_class', type: FACETS.term },
    { field: 'analyte_class', type: FACETS.term },
    { field: 'dataset_status', type: FACETS.term },
    { field: 'data_access_level', type: FACETS.term },
  ],
  // Flat rather than an `organs.hierarchy` -> `organs.label` hierarchy: `organs` is a plain
  // object array (not `nested`), so a nested terms aggregation cross-multiplies every organ's
  // hierarchy against every organ's label. Multi-organ datasets then list unrelated children
  // (the "Small Intestine" bucket shows "Lung (Left)"), which is why SenNet's organ
  // megahierarchy is not portable here.
  Organ: [
    { field: 'organs.label', type: FACETS.term, order: { type: '_term', dir: 'asc' } as const, isFilterable: true },
  ],
};

/**
 * The files search configuration, independent of app context so it can be exercised directly
 * against the index in tests.
 */
export function buildFilesSearchConfig({ endpoint, facetsEndpoint }: { endpoint: string; facetsEndpoint: string }) {
  return {
    endpoint,
    facetsEndpoint,
    mappingIndex: 'files',
    searchFields: ['rel_path', 'description', 'file_extension', 'dataset_hubmap_id', 'dataset_type', 'organs.label'],
    hubmapIdField: 'dataset_hubmap_id',
    uuidField: 'dataset_uuid',
    size: 18,
    sourceFields: {
      // Sortable dataset-level columns. The file-count and total-size columns are derived from
      // `inner_hits` rather than from a source field, so they are not listed here.
      table: ['dataset_hubmap_id', 'dataset_type', 'data_class', 'organs.label'],
      // Fetched for the row and its expanded file list, but not rendered as their own columns.
      _extra: ['dataset_uuid', 'rel_path', 'file_extension', 'size', 'description', 'file_uuid'],
    },
    sortField: { field: 'dataset_hubmap_id', direction: 'asc' as const },
    // No `uuid` on this index; also the field whose distinct values are the row count.
    uniqueSortField: 'dataset_uuid.keyword',
    // Required with `collapse`, so each dataset's representative row is chosen from the files that
    // actually match rather than from all of them.
    filterMode: 'query' as const,
    // Deliberately no `innerHits`. Requesting the grouped documents is what makes a collapsed query
    // expensive: with a filename filter active the same query costs ~12.7s with `inner_hits` and
    // ~215ms without. Per-row counts and sizes come from `useDatasetPageStats` instead, which is
    // both far cheaper and exact, and the file list itself is loaded when the picker opens.
    collapse: { field: 'dataset_uuid' },
    facets: filesFacetGroups,
    type: 'File' as const,
  };
}

function useFilesConfig() {
  const { filesElasticsearchEndpoint, filesFacetsEndpoint } = useAppContext();
  return buildFilesSearchConfig({
    endpoint: filesElasticsearchEndpoint,
    facetsEndpoint: filesFacetsEndpoint,
  });
}

function Files() {
  const config = useFilesConfig();
  return <Search config={config} />;
}

export default Files;
