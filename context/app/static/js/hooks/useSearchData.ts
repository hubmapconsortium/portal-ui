import { useCallback, useMemo } from 'react';
import useSWR, { SWRConfiguration } from 'swr';
import useSWRInfinite, { SWRInfiniteKeyLoader } from 'swr/infinite';

import { fetcher as fetch, multiFetcher as multiFetch } from 'js/helpers/swr';
import { getAuthHeader, addRestrictionsToQuery } from 'js/helpers/functions';
import { useAppContext } from 'js/components/Contexts';

import { AggregationsAggregate, SearchRequest, SearchResponseBody } from '@elastic/elasticsearch/lib/api/types';
import { SWRError } from 'js/helpers/swr/errors';

export interface Hit<Doc extends object | Record<string, unknown>> {
  _source: Doc;
}

export interface Hits<Doc extends object | Record<string, unknown>> {
  searchHits: Hit<Doc>[];
  isLoading: boolean;
}

interface UseSearchDataConfig extends SWRConfiguration {
  useDefaultQuery?: boolean;
  shouldFetch?: boolean;
}

interface BuildSearchRequestInitArgs {
  body: SearchRequest;
  authHeader: HeadersInit;
}

/**
 * Builds the auth header for the request
 * @returns The auth header if logged in, an empty object otherwise
 */
function useAuthHeader() {
  const { groupsToken } = useAppContext();
  return useMemo(() => getAuthHeader(groupsToken), [groupsToken]);
}

/**
 * Util function to create the request body for the search request
 * @param arg.query The search request
 * @param arg.useDefaultQuery Whether to apply the default query restrictions
 * @returns The request body
 */
function createSearchRequestBody({ query, useDefaultQuery }: { query: SearchRequest; useDefaultQuery: boolean }) {
  return useDefaultQuery ? addRestrictionsToQuery(query) : query;
}

function buildSearchRequestInit({ body, authHeader }: BuildSearchRequestInitArgs): RequestInit {
  return {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
    },
  };
}

interface RequestInitArgs {
  query: SearchRequest;
  useDefaultQuery: boolean;
}
function useRequestInit({ query, useDefaultQuery }: RequestInitArgs) {
  const authHeader = useAuthHeader();
  return useMemo(() => {
    const body = createSearchRequestBody({ query, useDefaultQuery });
    return buildSearchRequestInit({ body, authHeader });
  }, [query, useDefaultQuery, authHeader]);
}

interface UseSearchDataConfig extends SWRConfiguration {
  useDefaultQuery?: boolean;
  shouldFetch?: boolean;
}

interface UseSearchDataArgs {
  query: SearchRequest;
  config?: UseSearchDataConfig;
}

interface UseSearchData<Documents, Aggs = Record<string, AggregationsAggregate>> {
  searchData: SearchResponseBody<Documents, Aggs> | undefined;
  isLoading: boolean;
}

const defaultConfig = {
  useDefaultQuery: false,
  fetcher: fetch,
  fallbackData: {},
};

export default function useSearchData<Documents, Aggs>({
  query,
  config: { useDefaultQuery = false, fetcher = fetch, ...swrConfig } = defaultConfig,
}: UseSearchDataArgs): UseSearchData<Documents, Aggs> {
  const requestInit = useRequestInit({ query, useDefaultQuery });

  const { data: searchData, isLoading } = useSWR<SearchResponseBody<Documents, Aggs>>(
    { query, requestInit },
    fetcher,
    swrConfig,
  );

  return { searchData, isLoading };
}

export function useSearchHits({
  query,
  config: { useDefaultQuery = false, fetcher = fetch, ...swrConfig } = defaultConfig,
}: UseSearchDataArgs) {
  const { searchData, isLoading } = useSearchData({ query, config: { useDefaultQuery, fetcher, ...swrConfig } });
  const searchHits = searchData?.hits?.hits ?? [];
  return { searchHits, isLoading };
}

// Multisearch code below

type PluralQuery<T extends { query: SearchRequest }> = Omit<T, 'query'> & { queries: SearchRequest[] };

function useRequestInits({ queries, useDefaultQuery }: PluralQuery<RequestInitArgs>): RequestInit[] {
  const authHeader = useAuthHeader();
  const inits = useMemo<RequestInit[]>(
    () =>
      queries.map((query) => {
        const body = createSearchRequestBody({ query, useDefaultQuery });
        return buildSearchRequestInit({ body, authHeader });
      }),
    [queries, useDefaultQuery, authHeader],
  );
  return inits;
}

type UseMultiSearchDataArgs = PluralQuery<UseSearchDataArgs>;

const defaultMultiFetchConfig = {
  useDefaultQuery: false,
  fetcher: multiFetch,
  fallbackData: [],
};

interface UseMultiSearchData<Documents, Aggs = Record<string, AggregationsAggregate>> {
  searchData: SearchResponseBody<Documents, Aggs>[] | undefined;
  isLoading: boolean;
}
export function useMultiSearchData<Documents, Aggs>({
  queries,
  config: { useDefaultQuery = false, fetcher = multiFetch, ...swrConfig } = defaultMultiFetchConfig,
}: UseMultiSearchDataArgs): UseMultiSearchData<Documents, Aggs> {
  const requestInits = useRequestInits({ queries, useDefaultQuery });

  const { data: searchData, isLoading } = useSWR<SearchResponseBody<Documents, Aggs>[]>(
    { queries, requestInits },
    fetcher,
    swrConfig,
  );

  return { searchData, isLoading };
}

// Infinite search code below

function getTotalHitsCount(results?: SearchResponseBody<unknown, unknown>) {
  const total = results?.hits?.total;
  if (typeof total === 'number') {
    return total;
  }
  return total?.value;
}

function extractIDs(results?: SearchResponseBody<unknown, unknown>) {
  return results?.hits?.hits?.map((hit) => hit._id);
}

async function fetchAllIDs(...args: Parameters<typeof fetch>) {
  const results = await fetch<SearchResponseBody<unknown, unknown>>(...args);
  return extractIDs(results);
}

// We do not want the query to revalidate when _source or sort change.
const sharedIDsQueryClauses = { _source: false, sort: [{ _id: 'asc' }] };

export function useAllSearchIDs(
  query: SearchRequest,
  { useDefaultQuery = false, fetcher = fetch, ...swrConfigRest }: UseSearchDataConfig = {
    useDefaultQuery: false,
    fetcher: fetch,
  },
) {
  const { elasticsearchEndpoint, groupsToken } = useAppContext();

  const { searchData } = useSearchData({
    query: { ...query, track_total_hits: true, size: 0, ...sharedIDsQueryClauses },
    config: {
      useDefaultQuery,
      fetcher,
      ...swrConfigRest,
    },
  });

  const totalHitsCount = getTotalHitsCount(searchData);
  const numberOfPagesToRequest = totalHitsCount ? Math.ceil(10000 / totalHitsCount) : undefined;

  const getKey = useCallback(() => {
    if (numberOfPagesToRequest === undefined) {
      return null;
    }

    return [
      { ...query, ...sharedIDsQueryClauses },
      elasticsearchEndpoint,
      groupsToken,
      useDefaultQuery,
      numberOfPagesToRequest,
    ];
  }, [query, elasticsearchEndpoint, groupsToken, useDefaultQuery, numberOfPagesToRequest]);

  const { data } = useSWRInfinite(getKey, fetchAllIDs, {
    fallbackData: [],
    ...swrConfigRest,
  });

  return { allSearchIDs: data?.flat() ?? [], totalHitsCount };
}

// Get the sort array from the last hit. https://www.elastic.co/guide/en/elasticsearch/reference/current/paginate-search-results.html#search-after.
function getSearchAfterSort(hits: SearchResponseBody<unknown, unknown>['hits']['hits']) {
  const { sort } = hits.slice(-1)[0];
  return sort;
}

function getCombinedHits(pagesResults: SearchResponseBody<unknown, unknown>[]) {
  const hasData = pagesResults.length > 0;

  if (!hasData) {
    return { totalHitsCount: undefined, searchHits: [] };
  }

  return {
    totalHitsCount: getTotalHitsCount(pagesResults[0]),
    searchHits: pagesResults.map((d) => d?.hits?.hits).flat(),
  };
}

export function useScrollSearchHits(
  query: SearchRequest,
  { useDefaultQuery = false, fetcher = fetch, ...swrConfigRest }: UseSearchDataConfig = {
    useDefaultQuery: false,
    fetcher: fetch,
  },
) {
  const { elasticsearchEndpoint, groupsToken } = useAppContext();

  const getKey: SWRInfiniteKeyLoader = useCallback(
    (pageIndex: number, previousPageData: SearchResponseBody) => {
      const sharedKeyItems = [elasticsearchEndpoint, groupsToken, useDefaultQuery];

      const previousPageHits = previousPageData?.hits?.hits ?? [];

      if (previousPageData && !previousPageHits.length) return null;
      // First page, we return the key array unmodified.
      if (pageIndex === 0) return [{ ...query, track_total_hits: true }, ...sharedKeyItems];

      // Subsequent pages, we add the search after param to the query.
      const searchAfterSort = getSearchAfterSort(previousPageHits);
      return [{ ...query, track_total_hits: true, search_after: searchAfterSort }, ...sharedKeyItems];
    },
    [query, elasticsearchEndpoint, groupsToken, useDefaultQuery],
  );

  const { data, error, isLoading, isValidating, size, setSize } = useSWRInfinite<SearchResponseBody, SWRError>(
    getKey,
    fetcher,
    {
      fallbackData: [],
      revalidateAll: false,
      revalidateFirstPage: false,
      keepPreviousData: true,
      ...swrConfigRest,
    },
  );

  const { searchHits, totalHitsCount } = getCombinedHits(data ?? []);

  const isReachingEnd = searchHits.length === 0 || searchHits.length === totalHitsCount;

  const loadMore = useCallback(() => {
    if (isReachingEnd || isLoading || isValidating) {
      return;
    }
    setSize(size + 1).catch(console.error);
  }, [size, setSize, isReachingEnd, isLoading, isValidating]);

  return { searchHits, error, isLoading, setSize, loadMore, totalHitsCount, isReachingEnd };
}

export function useSearchTotalHitsCounts(
  queries: SearchRequest[],
  { useDefaultQuery = false, fetcher = multiFetch }: UseSearchDataConfig = {
    useDefaultQuery: false,
    fetcher: multiFetch,
  },
) {
  const swrConfig = { fallbackData: [] };
  const { searchData, isLoading } = useMultiSearchData({
    queries: queries.map((query) => ({ ...query, _source: false, size: 0, track_total_hits: true })),
    config: {
      useDefaultQuery,
      fetcher,
      ...swrConfig,
    },
  });

  return { totalHitsCounts: searchData?.map((d) => getTotalHitsCount(d)), isLoading };
}
