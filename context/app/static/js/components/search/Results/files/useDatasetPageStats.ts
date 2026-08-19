import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher } from 'js/helpers/swr';
import { SWRError } from 'js/helpers/swr/errors';
import { getAuthHeader } from 'js/helpers/functions';
import { useAppContext } from 'js/components/Contexts';
import { FACETS, useSearchStore } from '../../store';
import { buildQuery } from '../../utils';
import useESmapping, { isESMapping } from '../../useEsMapping';

const BY_DATASET_AGG = 'by_dataset';
const BYTES_AGG = 'bytes';

export interface DatasetStats {
  /** Files in this dataset matching the current query. Exact. */
  fileCount: number;
  /** Summed size of those files, in bytes. Exact. */
  bytes: number;
}

interface StatsResponse {
  aggregations?: {
    [BY_DATASET_AGG]?: {
      buckets: { key: string; doc_count: number; [BYTES_AGG]: { value: number } }[];
    };
  };
}

/**
 * Exact matching-file count and total size for each dataset on the current page.
 *
 * This replaces what `collapse`'s `inner_hits` used to provide, for two reasons:
 *
 * 1. `inner_hits` is what makes a collapsed query expensive -- with a filename wildcard active
 *    the same query costs ~12.7s with `inner_hits` and ~215ms without. This aggregation adds
 *    ~175ms, so the pair is roughly 25x cheaper than the single request it replaces.
 * 2. `inner_hits` returns at most its configured size, so summing it understated the size of any
 *    dataset with more matching files than that. An aggregation is exact.
 *
 * Scoped to the page's dataset uuids rather than the whole result set, which is what keeps it
 * cheap. Reuses the page's own filters so the count a row shows always matches what the
 * file-selection modal will list.
 */
export default function useDatasetPageStats(datasetUuids: string[]): {
  stats: Map<string, DatasetStats>;
  error?: SWRError;
  isLoading: boolean;
} {
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
    if (datasetUuids.length === 0 || !isESMapping(mappings)) {
      return null;
    }
    // Build the query through the normal path so every active filter is honoured, then attach
    // the aggregations, which `buildQuery` has no notion of.
    const built = buildQuery({
      filters: {
        ...filters,
        dataset_uuid: { type: FACETS.term, values: new Set(datasetUuids) },
      },
      facets: { ...facets, dataset_uuid: { field: 'dataset_uuid', type: FACETS.term } },
      search,
      size: 0,
      searchFields,
      sourceFields: {},
      sortField: { field: 'dataset_uuid', direction: 'asc' },
      filterMode: 'query',
      uniqueSortField: 'dataset_uuid.keyword',
      hubmapIdField,
      uuidField,
      filenameFilter,
      filenameField,
      mappings,
      buildAggregations: false,
    }) as Record<string, unknown> | null;

    if (!built) {
      return null;
    }
    // `sort` is meaningless with `size: 0`; the aggregation supplies the ordering that matters.
    const { sort, ...rest } = built;
    return {
      ...rest,
      size: 0,
      aggs: {
        [BY_DATASET_AGG]: {
          terms: { field: 'dataset_uuid.keyword', size: datasetUuids.length },
          aggs: { [BYTES_AGG]: { sum: { field: 'size' } } },
        },
      },
    };
  }, [
    datasetUuids,
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

  const { data, error, isLoading } = useSWR<StatsResponse, SWRError>(
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
    // Paging appends rows, so keep the previous page's numbers on screen rather than blanking
    // every row's count while the next page's stats load.
    { keepPreviousData: true },
  );

  const stats = useMemo(() => {
    const map = new Map<string, DatasetStats>();
    (data?.aggregations?.[BY_DATASET_AGG]?.buckets ?? []).forEach((bucket) => {
      map.set(bucket.key, { fileCount: bucket.doc_count, bytes: bucket[BYTES_AGG]?.value ?? 0 });
    });
    return map;
  }, [data]);

  return { stats, error, isLoading };
}
