import { useCallback, useMemo } from 'react';
import useSWRInfinite, { SWRInfiniteKeyLoader } from 'swr/infinite';
import { SWRConfiguration } from 'swr';
import { SearchRequest, SearchResponseBody } from '@elastic/elasticsearch/lib/api/types';

import { fetcher } from 'js/helpers/swr';
import { getAuthHeader } from 'js/helpers/functions';
import { useAppContext } from 'js/components/Contexts';
import { SWRError } from 'js/helpers/swr/errors';

import { getSearchAfterSort, getCombinedHits } from 'js/hooks/useSearchData';

function useAuthHeader() {
  const { groupsToken } = useAppContext();
  return useMemo(() => getAuthHeader(groupsToken), [groupsToken]);
}

interface BuildSearchRequestInitArgs {
  body: SearchRequest;
  authHeader: HeadersInit;
}

function buildSearchRequestInit({ body, authHeader }: BuildSearchRequestInitArgs): RequestInit {
  return {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      ...(authHeader ?? {}),
    },
  };
}

function useBuildRequestInit() {
  const authHeader = useAuthHeader();

  return useCallback(({ body }: { body: SearchRequest }) => buildSearchRequestInit({ body, authHeader }), [authHeader]);
}

export function useScrollSearchHits<Doc, Aggs>({
  query,
  endpoint,
  swrConfig,
}: {
  query: SearchRequest;
  endpoint: string;
  swrConfig: SWRConfiguration;
}) {
  const buildRequestInit = useBuildRequestInit();
  const getKey: SWRInfiniteKeyLoader = useCallback(
    (pageIndex: number, previousPageData: SearchResponseBody) => {
      const previousPageHits = previousPageData?.hits?.hits ?? [];

      if (previousPageData && !previousPageHits.length) return null;
      // First page, we return the key array unmodified.
      if (pageIndex === 0)
        return { requestInit: buildRequestInit({ body: { ...query, track_total_hits: true } }), url: endpoint };

      // Subsequent pages, we add the search after param to the query.
      const searchAfterSort = getSearchAfterSort(previousPageHits);
      return {
        requestInit: buildRequestInit({ body: { ...query, track_total_hits: true, search_after: searchAfterSort } }),
        url: endpoint,
      };
    },
    [query, buildRequestInit, endpoint],
  );

  const { data, error, isLoading, isValidating, size, setSize } = useSWRInfinite<
    SearchResponseBody<Doc, Aggs>,
    SWRError
  >(getKey, fetcher, {
    fallbackData: [],
    revalidateAll: false,
    revalidateFirstPage: false,
    keepPreviousData: true,
    ...swrConfig,
  });

  const { searchHits, totalHitsCount, aggregations } = getCombinedHits<Doc, Aggs>(data ?? []);

  const isReachingEnd = searchHits.length === 0 || searchHits.length === totalHitsCount;

  const loadMore = useCallback(() => {
    if (isReachingEnd || isLoading || isValidating) {
      return;
    }
    setSize(size + 1).catch(console.error);
  }, [size, setSize, isReachingEnd, isLoading, isValidating]);

  return {
    aggregations,
    searchHits,
    error,
    isLoading,
    setSize,
    loadMore,
    totalHitsCount,
    isReachingEnd,
  };
}
