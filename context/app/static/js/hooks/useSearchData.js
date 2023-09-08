import { useMemo, useCallback } from 'react';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { getAuthHeader, addRestrictionsToQuery } from 'js/helpers/functions';
import { useAppContext } from 'js/components/Contexts';

async function fetchSearchData(query, elasticsearchEndpoint, groupsToken, useDefaultQuery = true) {
  const authHeader = getAuthHeader(groupsToken);
  const response = await fetch(elasticsearchEndpoint, {
    method: 'POST',
    body: JSON.stringify(useDefaultQuery ? addRestrictionsToQuery(query) : query),
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
    },
  });

  if (!response.ok) {
    console.error('Search API failed', response);
    return undefined;
  }
  const results = await response.json();
  return results;
}

function useSearchData(
  query,
  useDefaultQuery = false,
  fetcher = fetchSearchData,
  swrConfig = {
    fallbackData: {},
  },
) {
  const { elasticsearchEndpoint, groupsToken } = useAppContext();

  const { data: searchData, isLoading } = useSWR(
    [query, elasticsearchEndpoint, groupsToken, useDefaultQuery],
    (args) => fetcher(...args),
    swrConfig,
  );

  return { searchData, isLoading };
}

function useSearchHits(
  query,
  { useDefaultQuery = false, fetcher = fetchSearchData, ...swrConfigRest } = {
    useDefaultQuery: false,
    fetcher: fetchSearchData,
  },
) {
  const swrConfig = swrConfigRest || { fallbackData: {} };
  const { searchData, isLoading } = useSearchData(query, useDefaultQuery, fetcher ?? fetchSearchData, {
    ...swrConfig,
  });
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
  }, [query, numberOfPagesToRequest, elasticsearchEndpoint, groupsToken, useDefaultQuery]);

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

const withFetcherArgs =
  (query, ...rest) =>
  (pageIndex, previousPageData) => {
    const previousPageHits = previousPageData?.hits?.hits ?? [];

    if (previousPageData && !previousPageHits.length) return null;
    // First page, we return the key array unmodified.
    if (pageIndex === 0) return [{ ...query, track_total_hits: true }, ...rest];

    // Subsequent pages, we add the search after param to the query.
    const searchAfterSort = getSearchAfterSort(previousPageHits);
    return [{ ...query, search_after: searchAfterSort }, ...rest];
  };

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
  { useDefaultQuery = false, fetcher = fetchSearchData, pageSize, ...swrConfigRest } = {
    useDefaultQuery: false,
    fetcher: fetchSearchData,
  },
) {
  const { elasticsearchEndpoint, groupsToken } = useAppContext();

  const getKey = useMemo(
    () => withFetcherArgs(query, elasticsearchEndpoint, groupsToken, useDefaultQuery),
    [query, elasticsearchEndpoint, groupsToken, useDefaultQuery],
  );

  const { data, error, isLoading, size, setSize } = useSWRInfinite(getKey, (args) => fetcher(...args), {
    fallbackData: [],
    ...swrConfigRest,
  });

  const { searchHits, totalHitsCount } = getCombinedHits(data);

  const isReachingEnd = searchHits.length === 0 || searchHits.length === totalHitsCount;

  const loadMore = useCallback(() => {
    if (isReachingEnd) {
      return;
    }
    setSize(size + 1);
  }, [size, setSize, isReachingEnd]);

  return { searchHits, error, isLoading, setSize, loadMore, totalHitsCount, isReachingEnd };
}

export { fetchSearchData, useSearchHits, useScrollSearchHits, useAllSearchIDs };
export default useSearchData;
