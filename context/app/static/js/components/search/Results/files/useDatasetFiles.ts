import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher } from 'js/helpers/swr';
import { SWRError } from 'js/helpers/swr/errors';
import { getAuthHeader } from 'js/helpers/functions';
import { useAppContext } from 'js/components/Contexts';
import { SearchResponseBody } from 'js/typings/elasticsearch';
import { FACETS, useSearchStore } from '../../store';
import { buildQuery } from '../../utils';
import useESmapping, { isESMapping } from '../../useEsMapping';
import { FileDocument } from './utils';

/** Ceiling on files fetched for one dataset. Some CODEX datasets hold tens of thousands. */
export const MAX_DATASET_FILES = 10_000;

/**
 * Fetches the files of a single dataset that match the current search.
 *
 * The list has to reflect the active filters, not just the dataset: a row reports "N files"
 * under the current filters, and selecting from a different list than the row counted would
 * put files in the manifest the user never saw.
 *
 * That is achieved by reusing the page's own filters and adding a `dataset_uuid` term filter,
 * so no query is hand-assembled here.
 */
interface DatasetFilesResult {
  files: FileDocument[];
  error?: SWRError;
  isLoading: boolean;
}

export default function useDatasetFiles(datasetUuid: string | null, fileCount: number): DatasetFilesResult {
  const { groupsToken } = useAppContext();
  const endpoint = useSearchStore((state) => state.endpoint);
  const mappingIndex = useSearchStore((state) => state.mappingIndex);
  const filters = useSearchStore((state) => state.filters);
  const facets = useSearchStore((state) => state.facets);
  const search = useSearchStore((state) => state.search);
  const searchFields = useSearchStore((state) => state.searchFields);
  const hubmapIdField = useSearchStore((state) => state.hubmapIdField);
  const uuidField = useSearchStore((state) => state.uuidField);

  const mappings = useESmapping(mappingIndex);

  const body = useMemo(() => {
    if (!datasetUuid || !isESMapping(mappings)) {
      return null;
    }
    return buildQuery({
      // Adding the dataset as an ordinary term filter keeps this on the public API rather than
      // splicing a clause into the built query.
      filters: {
        ...filters,
        dataset_uuid: { type: FACETS.term, values: new Set([datasetUuid]) },
      },
      facets: { ...facets, dataset_uuid: { field: 'dataset_uuid', type: FACETS.term } },
      search,
      size: Math.min(Math.max(fileCount, 1), MAX_DATASET_FILES),
      searchFields,
      sourceFields: { files: ['rel_path', 'file_extension', 'size', 'description', 'file_uuid'] },
      sortField: { field: 'rel_path', direction: 'asc' },
      // No collapse: this wants the individual files, not one row per dataset.
      filterMode: 'query',
      uniqueSortField: 'dataset_uuid.keyword',
      hubmapIdField,
      uuidField,
      mappings,
      buildAggregations: false,
    });
  }, [datasetUuid, mappings, filters, facets, search, searchFields, fileCount, hubmapIdField, uuidField]);

  const { data, error, isLoading } = useSWR<SearchResponseBody<FileDocument, unknown>, SWRError>(
    body
      ? {
          url: endpoint,
          requestInit: {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeader(groupsToken) },
            body: JSON.stringify(body),
          },
        }
      : null,
    fetcher,
  );

  const files = useMemo<FileDocument[]>(
    () =>
      (data?.hits?.hits ?? []).map((hit) => hit._source).filter((source): source is FileDocument => Boolean(source)),
    [data],
  );

  return { files, error, isLoading };
}
