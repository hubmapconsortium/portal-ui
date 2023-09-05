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

const getOuterHits = (d) => d?.hits;

const getFirstPageHits = (d) => getOuterHits(d[0]);

function getCombinedHits(data) {
  const hasData = data.length > 0;

  if (!hasData) {
    return { totalHitsCount: undefined, searchHits: [] };
  }

  return {
    totalHitsCount: getFirstPageHits(data)?.total?.value,
    searchHits: data.map((d) => getOuterHits(d)?.hits).flat(),
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
  const swrConfig = { fallbackData: [], ...swrConfigRest };

  const getKey = useMemo(
    () => withFetcherArgs(query, elasticsearchEndpoint, groupsToken, useDefaultQuery),
    [query, elasticsearchEndpoint, groupsToken, useDefaultQuery],
  );

  const { data, error, isLoading, size, setSize } = useSWRInfinite(getKey, (args) => fetcher(...args), {
    ...swrConfig,
  });

  const { searchHits, totalHitsCount } = getCombinedHits(data);

  const isEmpty = getFirstPageHits(data)?.hits?.length === 0;

  const isReachingEnd = isEmpty || searchHits.length === totalHitsCount;

  const loadMore = useCallback(() => {
    if (isReachingEnd) {
      return;
    }
    setSize(size + 1);
  }, [size, setSize, isReachingEnd]);

  return { searchHits, error, isLoading, setSize, loadMore, totalHitsCount, isReachingEnd };
}

export { fetchSearchData, useSearchHits, useScrollSearchHits };
export default useSearchData;
