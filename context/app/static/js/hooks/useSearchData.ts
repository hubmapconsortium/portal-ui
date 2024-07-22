import { useCallback, useMemo } from 'react';
import useSWR, { SWRConfiguration } from 'swr';
import useSWRInfinite, { SWRInfiniteKeyLoader } from 'swr/infinite';

import { fetcher as fetch, multiFetcher as multiFetch } from 'js/helpers/swr';
import { getAuthHeader, addRestrictionsToQuery } from 'js/helpers/functions';
import { useAppContext } from 'js/components/Contexts';

import {
  AggregationsAggregate,
  SearchHit,
  SearchRequest,
  SearchResponseBody,
} from '@elastic/elasticsearch/lib/api/types';
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
  const body = createSearchRequestBody({ query, useDefaultQuery });
  return buildSearchRequestInit({ body, authHeader });
}

interface UseSearchDataConfig extends SWRConfiguration {
  useDefaultQuery?: boolean;
  shouldFetch?: boolean;
}

interface UseSearchData<Documents, Aggs = Record<string, AggregationsAggregate>> {
  searchData: SearchResponseBody<Documents, Aggs>;
  isLoading: boolean;
}

interface UseHitsData<Documents> {
  searchHits: NonNullable<Required<SearchHit<Documents>>[]>;
  isLoading: boolean;
}

const defaultConfig = {
  useDefaultQuery: true,
  fetcher: fetch,
  fallbackData: {},
};

// Legacy adapter for `useSearchkitSDK.js` and array-based keys
export async function fetchSearchData<Documents, Aggs>(
  query: SearchRequest,
  url: string,
  token: string,
): Promise<SearchResponseBody<Documents, Aggs>> {
  const body = createSearchRequestBody({ query, useDefaultQuery: true });
  const requestInit = buildSearchRequestInit({ body, authHeader: getAuthHeader(token) });
  const searchResponse = await fetch<SearchResponseBody<Documents, Aggs> & Response>({
    url,
    requestInit,
    expectedStatusCodes: [200, 303],
    returnResponse: true,
  });

  if (searchResponse?.status === 303) {
    const s3URL = await searchResponse.text();
    return fetch({
      url: s3URL,
    });
  }

  return searchResponse.json() as Promise<SearchResponseBody<Documents, Aggs>>;
}

export default function useSearchData<Documents, Aggs>(
  query: SearchRequest,
  {
    useDefaultQuery = defaultConfig.useDefaultQuery,
    fetcher = defaultConfig.fetcher,
    ...swrConfig
  }: UseSearchDataConfig | undefined = defaultConfig,
): UseSearchData<Documents, Aggs> {
  const requestInit = useRequestInit({ query, useDefaultQuery });
  const { elasticsearchEndpoint } = useAppContext();

  const { data, isLoading } = useSWR<SearchResponseBody<Documents, Aggs>>(
    { query, requestInit, url: elasticsearchEndpoint },
    fetcher,
    swrConfig,
  );

  // The data is guaranteed to be defined because we provide a fallbackData
  return { searchData: data!, isLoading };
}

export function useSearchHits<Documents>(
  query: SearchRequest,
  {
    useDefaultQuery = defaultConfig.useDefaultQuery,
    fetcher = defaultConfig.fetcher,
    ...swrConfig
  }: UseSearchDataConfig | undefined = defaultConfig,
): UseHitsData<Documents> {
  const { searchData, isLoading } = useSearchData(query, { useDefaultQuery, fetcher, ...swrConfig });
  const searchHits = (searchData?.hits?.hits ?? []) as Required<SearchHit<Documents>>[];
  return { searchHits, isLoading };
}

// Multisearch

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

const defaultMultiFetchConfig = {
  useDefaultQuery: true,
  fetcher: multiFetch,
  fallbackData: [],
};

interface UseMultiSearchData<Documents, Aggs = Record<string, AggregationsAggregate>> {
  searchData: SearchResponseBody<Documents, Aggs>[] | undefined;
  isLoading: boolean;
}
export function useMultiSearchData<Documents, Aggs>(
  queries: SearchRequest[],
  {
    useDefaultQuery = defaultMultiFetchConfig.useDefaultQuery,
    fetcher = defaultMultiFetchConfig.fetcher,
    ...swrConfig
  }: UseSearchDataConfig = defaultMultiFetchConfig,
): UseMultiSearchData<Documents, Aggs> {
  const requestInits = useRequestInits({ queries, useDefaultQuery });
  const { elasticsearchEndpoint } = useAppContext();

  const { data: searchData, isLoading } = useSWR<SearchResponseBody<Documents, Aggs>[]>(
    { queries, requestInits, url: elasticsearchEndpoint },
    fetcher,
    swrConfig,
  );

  return { searchData, isLoading };
}

// Infinite search

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

async function fetchAllIDs(...args: Parameters<typeof fetchSearchData>) {
  const results = await fetchSearchData(...args);
  return extractIDs(results);
}

// We do not want the query to revalidate when _source or sort change.
const sharedIDsQueryClauses = { _source: false, sort: [{ _id: 'asc' }] };

export function useAllSearchIDs(
  query: SearchRequest,
  {
    useDefaultQuery = defaultConfig.useDefaultQuery,
    fetcher = defaultConfig.fetcher,
    ...swrConfigRest
  }: UseSearchDataConfig = defaultConfig,
) {
  const { elasticsearchEndpoint, groupsToken } = useAppContext();

  const { searchData } = useSearchData(
    { ...query, track_total_hits: true, size: 0, ...sharedIDsQueryClauses },
    {
      useDefaultQuery,
      fetcher,
      ...swrConfigRest,
    },
  );

  const totalHitsCount = getTotalHitsCount(searchData);
  const numberOfPagesToRequest = totalHitsCount ? Math.ceil(10000 / totalHitsCount) : undefined;

  const getKey: SWRInfiniteKeyLoader = useCallback(() => {
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

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
  // @ts-expect-error - revisit to make these keys more type safe
  const { data } = useSWRInfinite(getKey, (args) => fetchAllIDs(...args), {
    fallbackData: [],
    ...swrConfigRest,
  });

  return { allSearchIDs: data?.flat?.() ?? [], totalHitsCount };
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
  { useDefaultQuery = false, fetcher = fetchSearchData, ...swrConfigRest }: UseSearchDataConfig = {
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
    // TODO: revisit to fix types/make keys more type-safe
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument
    (args) => fetcher(...args),
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
  const { searchData, isLoading } = useMultiSearchData(
    queries.map((query) => ({ ...query, _source: false, size: 0, track_total_hits: true })),
    {
      useDefaultQuery,
      fetcher,
      ...swrConfig,
    },
  );

  return { totalHitsCounts: searchData?.map((d) => getTotalHitsCount(d)), isLoading };
}
