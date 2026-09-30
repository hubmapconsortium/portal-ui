import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher } from 'js/helpers/swr';
import { SWRError } from 'js/helpers/swr/errors';
import { getAuthHeader } from 'js/helpers/functions';
import { useAppContext } from 'js/components/Contexts';
import { useSearchStore } from '../../store';

const BY_DATASET_AGG = 'by_dataset';

interface CountsResponse {
  aggregations?: {
    [BY_DATASET_AGG]?: {
      buckets: { key: string; doc_count: number }[];
    };
  };
}

/**
 * Total file count per dataset, ignoring the active filters.
 *
 * Deliberately not built through `buildQuery`, which is the opposite of what `useDatasetPageStats`
 * does. A whole-dataset selection means *every* file in the dataset -- it is emitted to the manifest
 * as a single directory line, so a filtered count would claim fewer files than the download
 * delivers. Only whole-selected datasets need this; file-level selections already know their own
 * size, so a selection with no whole datasets issues no request at all.
 */
export default function useWholeDatasetFileCounts(datasetUuids: string[]): {
  counts: Map<string, number>;
  error?: SWRError;
  isLoading: boolean;
} {
  const { groupsToken } = useAppContext();
  const endpoint = useSearchStore((state) => state.endpoint);

  // Sorted so that selecting the same datasets in a different order hits one SWR cache entry.
  const uuids = useMemo(() => [...datasetUuids].sort(), [datasetUuids]);

  const { data, error, isLoading } = useSWR<CountsResponse, SWRError>(
    uuids.length
      ? {
          url: endpoint,
          requestInit: {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeader(groupsToken) },
            body: JSON.stringify({
              size: 0,
              query: { terms: { 'dataset_uuid.keyword': uuids } },
              aggs: { [BY_DATASET_AGG]: { terms: { field: 'dataset_uuid.keyword', size: uuids.length } } },
            }),
          },
        }
      : null,
    fetcher,
    // Selecting one more dataset re-keys this; keep the running total on screen rather than
    // blanking it on every click.
    { keepPreviousData: true },
  );

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    (data?.aggregations?.[BY_DATASET_AGG]?.buckets ?? []).forEach((bucket) => {
      map.set(bucket.key, bucket.doc_count);
    });
    return map;
  }, [data]);

  return { counts, error, isLoading };
}
