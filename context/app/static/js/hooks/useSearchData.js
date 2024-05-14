import { useCallback } from 'react';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';

import { fetcher as fetch, multiFetcher as multiFetch } from 'js/helpers/swr';
import { getAuthHeader, addRestrictionsToQuery } from 'js/helpers/functions';
import { useAppContext } from 'js/components/Contexts';

function buildSearchRequestInit({ query, groupsToken, useDefaultQuery }) {
  const authHeader = getAuthHeader(groupsToken);

  return {
    method: 'POST',
    body: JSON.stringify(useDefaultQuery ? addRestrictionsToQuery(query) : query),
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
    },
  };
}

async function fetchSearchData(query, elasticsearchEndpoint, groupsToken, useDefaultQuery = true) {
  const searchResponse = await fetch({
    url: elasticsearchEndpoint,
    requestInit: buildSearchRequestInit({ query, groupsToken, useDefaultQuery }),
    expectedStatusCodes: [200, 303],
    returnResponse: true,
  });

  if (searchResponse.status === 303) {
    const s3URL = await searchResponse.text();
    return fetch({
      url: s3URL,
    });
  }
  return searchResponse.json();
}

async function multiFetchSearchData(queries, elasticsearchEndpoint, groupsToken, useDefaultQuery = true) {
  return multiFetch({
    urls: [elasticsearchEndpoint],
    requestInits: queries.map((query) => buildSearchRequestInit({ query, groupsToken, useDefaultQuery })),
  });
}

function useSearchData(
  queries,
  useDefaultQuery = false,
  fetcher = fetchSearchData,
  swrConfig = {
    fallbackData: {},
  },
  shouldFetch = true,
) {
  const { elasticsearchEndpoint, groupsToken } = useAppContext();

  const { data: searchData, isLoading } = useSWR(
    shouldFetch ? [queries, elasticsearchEndpoint, groupsToken, useDefaultQuery] : null,
    (args) => fetcher(...args),
    swrConfig,
  );

  return { searchData, isLoading };
}

function useSearchHits(
  query,
  { useDefaultQuery = false, fetcher = fetchSearchData, shouldFetch = true, ...swrConfigRest } = {
    useDefaultQuery: false,
    fetcher: fetchSearchData,
  },
) {
  const swrConfig = swrConfigRest || { fallbackData: {} };
  const { searchData, isLoading } = useSearchData(
    query,
    useDefaultQuery,
    fetcher ?? fetchSearchData,
    {
      ...swrConfig,
    },
    shouldFetch,
  );
  const searchHits = searchData?.hits?.hits || [];
  return { searchHits, isLoading };
}

function getTotalHitsCount(results) {
  return results?.hits?.total?.value;
}

async function fetchAllIDs(...args) {
  const results = await fetchSearchData(...args);
  const hits = results?.hits?.hits ?? [];
  // eslint-disable-next-line no-underscore-dangle
  return hits.map((hit) => hit?._id);
}

// We do not want the query to revalidate when _source or sort change.
const sharedIDsQueryClauses = { _source: false, sort: [{ _id: 'asc' }] };

function useAllSearchIDs(
  query,
  { useDefaultQuery = false, ...swrConfigRest } = {
    useDefaultQuery: false,
    fetcher: fetchSearchData,
  },
) {
  const { elasticsearchEndpoint, groupsToken } = useAppContext();

  const { searchData } = useSearchData(
    { ...query, track_total_hits: true, size: 0, ...sharedIDsQueryClauses },
    useDefaultQuery,
    fetchSearchData,
    {
      fallbackData: {},
      ...swrConfigRest,
    },
  );

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

  const { data } = useSWRInfinite(getKey, (args) => fetchAllIDs(...args), {
    fallbackData: [],
    ...swrConfigRest,
  });

  return { allSearchIDs: data.flat() };
}

// Get the sort array from the last hit. https://www.elastic.co/guide/en/elasticsearch/reference/current/paginate-search-results.html#search-after.
function getSearchAfterSort(hits) {
  const { sort } = hits.slice(-1)[0];
  return sort;
}

function getCombinedHits(pagesResults) {
  const hasData = pagesResults.length > 0;

  if (!hasData) {
    return { totalHitsCount: undefined, searchHits: [] };
  }

  return {
    totalHitsCount: getTotalHitsCount(pagesResults[0]),
    searchHits: pagesResults.map((d) => d?.hits?.hits).flat(),
  };
}

function useScrollSearchHits(
  query,
  { useDefaultQuery = false, fetcher = fetchSearchData, ...swrConfigRest } = {
    useDefaultQuery: false,
    fetcher: fetchSearchData,
  },
) {
  const { elasticsearchEndpoint, groupsToken } = useAppContext();

  const getKey = useCallback(
    (pageIndex, previousPageData) => {
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

  const { data, error, isLoading, isValidating, size, setSize } = useSWRInfinite(getKey, (args) => fetcher(...args), {
    fallbackData: [],
    revalidateAll: false,
    revalidateFirstPage: false,
    keepPreviousData: true,
    ...swrConfigRest,
  });

  const { searchHits, totalHitsCount } = getCombinedHits(data);

  const isReachingEnd = searchHits.length === 0 || searchHits.length === totalHitsCount;

  const loadMore = useCallback(() => {
    if (isReachingEnd || isLoading || isValidating) {
      return;
    }
    setSize(size + 1);
  }, [size, setSize, isReachingEnd, isLoading, isValidating]);

  return { searchHits, error, isLoading, setSize, loadMore, totalHitsCount, isReachingEnd };
}

function useSearchTotalHitsCounts(
  queries,
  { useDefaultQuery = false, fetcher = multiFetchSearchData } = {
    useDefaultQuery: false,
    fetcher: multiFetchSearchData,
  },
) {
  const swrConfig = { fallbackData: [] };
  const { searchData, isLoading } = useSearchData(
    queries.map((query) => ({ ...query, _source: false, size: 0, track_total_hits: true })),
    useDefaultQuery,
    fetcher ?? multiFetchSearchData,
    {
      ...swrConfig,
    },
  );

  return { totalHitsCounts: searchData.map((d) => getTotalHitsCount(d)), isLoading };
}

export { fetchSearchData, useSearchHits, useScrollSearchHits, useAllSearchIDs, useSearchTotalHitsCounts };
export default useSearchData;
