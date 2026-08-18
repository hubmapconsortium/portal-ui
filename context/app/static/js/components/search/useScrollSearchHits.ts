import { useCallback, useMemo, useState } from 'react';
import useSWRInfinite, { SWRInfiniteKeyLoader } from 'swr/infinite';
import { SearchRequest, SearchResponseBody, SortResults } from 'js/typings/elasticsearch';

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
  /** Offset for `from`-based paging, used when `search_after` is unavailable. */
  fromOffset?: number;
} & Omit<SearchStoreState, 'swrConfig' | 'view' | 'type' | 'analyticsCategory' | 'mappingIndex' | 'facetsEndpoint'>;

async function fetchSearchHits<Doc, Aggs>({
  endpoint,
  authHeader,
  searchAfterSort,
  fromOffset,
  mappings,
  buildAggregations,
  ...rest
}: FetchSearcHitTypes & {
  mappings: Mappings | Record<string, never>;
  buildAggregations?: boolean;
}) {
  const query = buildQuery({ mappings, buildAggregations, ...rest });

  return fetcher<SearchResponseBody<Doc, Aggs>>({
    url: endpoint,
    requestInit: buildSearchRequestInit({
      authHeader,
      body: {
        ...query,
        track_total_hits: true,
        ...(searchAfterSort ? { search_after: searchAfterSort } : {}),
        ...(fromOffset ? { from: fromOffset } : {}),
      },
    }),
  });
}

function noLoadKey() {
  return null;
}

/**
 * Elasticsearch's default `index.max_result_window`. `from`-based paging cannot reach past it
 * (it errors rather than returning an empty page), which bounds how many collapsed groups a
 * collapsed search can walk through.
 */
export const MAX_RESULT_WINDOW = 10_000;

// TODO: Conform search hooks to use elastic-builder and dedupe useScrollSearchHits hooks
export function useScrollSearchHits<Doc, Aggs>({
  endpoint,
  swrConfig,
  mappingIndex,
  facetsEndpoint,
  ...rest
}: Omit<SearchStoreState, 'view' | 'type' | 'analyticsCategory' | 'initialFilters'>) {
  const authHeader = useAuthHeader();
  const mappings = useESmapping(mappingIndex);
  // When a separate endpoint serves the facets, asking for aggregations here as well would
  // pay their full cost twice -- and against a large index the combined request is far
  // slower than either half (see `useFacetAggregations`).
  const buildAggregations = !facetsEndpoint;
  // Elasticsearch refuses `collapse` together with `search_after`
  // ("cannot use `collapse` in conjunction with `search_after`"), so collapsed searches page
  // with `from` instead. `from` indexes collapsed groups, and is capped by
  // `index.max_result_window`.
  const usesFromPaging = Boolean(rest.collapse);

  const getKey: SWRInfiniteKeyLoader = useCallback(
    (pageIndex: number, previousPageData: SearchResponseBody<Doc, Aggs>) => {
      const previousPageHits = previousPageData?.hits?.hits ?? [];

      if (previousPageData && !previousPageHits.length) return null;
      // First page, we return the key array unmodified.
      if (pageIndex === 0) return { ...rest, authHeader, endpoint, buildAggregations };

      if (usesFromPaging) {
        const fromOffset = pageIndex * rest.size;
        // Asking past the result window is a hard error rather than an empty page, so stop.
        if (fromOffset + rest.size > MAX_RESULT_WINDOW) return null;
        return { ...rest, endpoint, authHeader, fromOffset, buildAggregations };
      }

      // Subsequent pages, we add the search after param to the query.
      const searchAfterSort = getSearchAfterSort(previousPageHits);
      return {
        ...rest,
        endpoint,
        authHeader,
        searchAfterSort,
        buildAggregations,
      };
    },
    [rest, endpoint, authHeader, buildAggregations, usesFromPaging],
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

  // Latched flag: once data has loaded once, stay "not loading" even if SWR
  // re-validates and the loading flag briefly flips true again. Stored in
  // useState with a guarded set-during-render so the flip happens in the
  // same render that sees the first data, no extra frame of flicker.
  const [hasRun, setHasRun] = useState(false);

  const { searchHits, totalHitsCount, aggregations } = useMemo(() => getCombinedHits<Doc, Aggs>(data ?? []), [data]);

  const isReachingEnd = searchHits.length === 0 || searchHits.length === totalHitsCount;

  const loadMore = useCallback(() => {
    if (isReachingEnd || isLoading || isValidating) {
      return;
    }
    setSize(size + 1).catch(console.error);
  }, [size, setSize, isReachingEnd, isLoading, isValidating]);

  if (data?.length && !hasRun) {
    setHasRun(true);
  }

  const z = isLoading || !hasRun;

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
