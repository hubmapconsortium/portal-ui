import { useCallback, useMemo, useRef } from 'react';
import useSWRInfinite, { SWRInfiniteKeyLoader } from 'swr/infinite';
import { SearchRequest, SearchResponseBody, SortResults } from '@elastic/elasticsearch/lib/api/types';

import { fetcher } from 'js/helpers/swr';
import { getAuthHeader } from 'js/helpers/functions';
import { useAppContext } from 'js/components/Contexts';
import { SWRError } from 'js/helpers/swr/errors';
import { getSearchAfterSort, getCombinedHits } from 'js/hooks/useSearchData';
import { buildQuery } from './utils';
import { SearchStoreState } from './store';
import useESmapping, { isESMapping, Mappings } from './useEsMapping';

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

type FetchSearcHitTypes = {
  endpoint: string;
  authHeader: HeadersInit;
  searchAfterSort?: SortResults;
} & Omit<SearchStoreState, 'swrConfig' | 'view' | 'type' | 'analyticsCategory'>;

async function fetchSearchHits<Doc, Aggs>({
  endpoint,
  authHeader,
  searchAfterSort,
  mappings,
  ...rest
}: FetchSearcHitTypes & { mappings: Mappings | Record<string, never> }) {
  const query = buildQuery({ mappings, ...rest });

  return fetcher<SearchResponseBody<Doc, Aggs>>({
    url: endpoint,
    requestInit: buildSearchRequestInit({
      authHeader,
      body: {
        ...query,
        track_total_hits: true,
        ...(searchAfterSort ? { search_after: searchAfterSort } : {}),
      },
    }),
  });
}

function noLoadKey() {
  return null;
}

// TODO: Conform search hooks to use elastic-builder and dedupe useScrollSearchHits hooks
export function useScrollSearchHits<Doc, Aggs>({
  endpoint,
  swrConfig,
  ...rest
}: Omit<SearchStoreState, 'view' | 'type' | 'analyticsCategory' | 'initialFilters'>) {
  const authHeader = useAuthHeader();
  const mappings = useESmapping();

  const getKey: SWRInfiniteKeyLoader = useCallback(
    (pageIndex: number, previousPageData: SearchResponseBody) => {
      const previousPageHits = previousPageData?.hits?.hits ?? [];

      if (previousPageData && !previousPageHits.length) return null;
      // First page, we return the key array unmodified.
      if (pageIndex === 0) return { ...rest, authHeader, endpoint };

      // Subsequent pages, we add the search after param to the query.
      const searchAfterSort = getSearchAfterSort(previousPageHits);
      return {
        ...rest,
        endpoint,
        authHeader,
        searchAfterSort,
      };
    },
    [rest, endpoint, authHeader],
  );

  const { data, error, isLoading, isValidating, size, setSize } = useSWRInfinite<
    SearchResponseBody<Doc, Aggs>,
    SWRError
  >(isESMapping(mappings) ? getKey : noLoadKey, (args: FetchSearcHitTypes) => fetchSearchHits({ ...args, mappings }), {
    fallbackData: [],
    revalidateAll: false,
    revalidateFirstPage: false,
    keepPreviousData: true,
    ...swrConfig,
  });

  const hasRun = useRef<boolean>(false);

  const { searchHits, totalHitsCount, aggregations } = useMemo(() => getCombinedHits<Doc, Aggs>(data ?? []), [data]);

  const isReachingEnd = searchHits.length === 0 || searchHits.length === totalHitsCount;

  const loadMore = useCallback(() => {
    if (isReachingEnd || isLoading || isValidating) {
      return;
    }
    setSize(size + 1).catch(console.error);
  }, [size, setSize, isReachingEnd, isLoading, isValidating]);

  if (data?.length) {
    hasRun.current = true;
  }

  const z = isLoading || !hasRun.current;

  return {
    aggregations,
    searchHits,
    error,
    isLoading: z,
    setSize,
    loadMore,
    totalHitsCount,
    isReachingEnd,
  };
}
