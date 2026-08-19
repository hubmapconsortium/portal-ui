import useSWRInfinite, { SWRInfiniteKeyLoader } from 'swr/infinite';
import { useCallback, useMemo } from 'react';

import { fetcher } from 'js/helpers/swr';
import { SWRError } from 'js/helpers/swr/errors';
import { getAuthHeader } from 'js/helpers/functions';
import { useAppContext } from 'js/components/Contexts';
import { SearchResponseBody } from 'js/typings/elasticsearch';
import { FACETS, useSearchStore } from '../../store';
import { buildQuery } from '../../utils';
import useESmapping, { isESMapping } from '../../useEsMapping';
import { FileDocument } from './utils';

/**
 * Files fetched per page inside the selection modal.
 *
 * Deliberately small: the largest dataset in the index holds 480,337 files, so the list has to be
 * paged rather than fetched whole. `search_after` is available here because this query does not
 * collapse.
 */
export const DATASET_FILES_PAGE_SIZE = 200;

interface DatasetFilesResult {
  files: FileDocument[];
  error?: SWRError;
  isLoading: boolean;
  isReachingEnd: boolean;
  loadMore: () => void;
}

/**
 * Fetches the files of a single dataset that match the current search, a page at a time.
 *
 * The list has to reflect the active filters, not just the dataset: a row reports "N files" under
 * the current filters, and selecting from a different list than the row counted would put files in
 * the manifest the user never saw. That is achieved by reusing the page's own filters and adding a
 * `dataset_uuid` term filter, so no query is hand-assembled here -- which also means the filename
 * filter is honoured automatically.
 */
export default function useDatasetFiles(datasetUuid: string | null): DatasetFilesResult {
  const { groupsToken } = useAppContext();
  const endpoint = useSearchStore((state) => state.endpoint);
  const mappingIndex = useSearchStore((state) => state.mappingIndex);
  const filters = useSearchStore((state) => state.filters);
  const facets = useSearchStore((state) => state.facets);
  const search = useSearchStore((state) => state.search);
  const searchFields = useSearchStore((state) => state.searchFields);
  const hubmapIdField = useSearchStore((state) => state.hubmapIdField);
  const uuidField = useSearchStore((state) => state.uuidField);
  const filenameFilter = useSearchStore((state) => state.filenameFilter);
  const filenameField = useSearchStore((state) => state.filenameField);

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
      size: DATASET_FILES_PAGE_SIZE,
      searchFields,
      sourceFields: { files: ['rel_path', 'file_extension', 'size', 'description', 'file_uuid'] },
      // Sorting by path groups a dataset's files by directory in the listing, which is how users
      // navigate the tiled-image datasets that hold hundreds of thousands of files.
      sortField: { field: 'rel_path', direction: 'asc' },
      // No collapse: this wants the individual files, not one row per dataset.
      filterMode: 'query',
      uniqueSortField: 'dataset_uuid.keyword',
      hubmapIdField,
      uuidField,
      filenameFilter,
      filenameField,
      mappings,
      buildAggregations: false,
    }) as Record<string, unknown> | null;
  }, [
    datasetUuid,
    mappings,
    filters,
    facets,
    search,
    searchFields,
    hubmapIdField,
    uuidField,
    filenameFilter,
    filenameField,
  ]);

  const getKey: SWRInfiniteKeyLoader = useCallback(
    (pageIndex: number, previous: SearchResponseBody<FileDocument, unknown>) => {
      if (!body) return null;
      const previousHits = previous?.hits?.hits ?? [];
      if (previous && previousHits.length === 0) return null;
      const searchAfter = pageIndex === 0 ? undefined : previousHits[previousHits.length - 1]?.sort;
      return {
        url: endpoint,
        requestInit: {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeader(groupsToken) },
          body: JSON.stringify(searchAfter ? { ...body, search_after: searchAfter } : body),
        },
      };
    },
    [body, endpoint, groupsToken],
  );

  const { data, error, isLoading, size, setSize } = useSWRInfinite<SearchResponseBody<FileDocument, unknown>, SWRError>(
    getKey,
    fetcher,
    { revalidateFirstPage: false, keepPreviousData: true },
  );

  const files = useMemo<FileDocument[]>(
    () =>
      (data ?? [])
        .flatMap((page) => page?.hits?.hits ?? [])
        .map((hit) => hit._source)
        .filter((source): source is FileDocument => Boolean(source)),
    [data],
  );

  const lastPageCount = data?.[data.length - 1]?.hits?.hits?.length ?? 0;
  const isReachingEnd = Boolean(data?.length) && lastPageCount < DATASET_FILES_PAGE_SIZE;

  const loadMore = useCallback(() => {
    if (!isReachingEnd && !isLoading) {
      setSize(size + 1).catch(console.error);
    }
  }, [isReachingEnd, isLoading, setSize, size]);

  return { files, error, isLoading, isReachingEnd, loadMore };
}
