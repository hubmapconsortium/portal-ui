import useSWR from 'swr';
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

export { fetchSearchData, useSearchHits };
export default useSearchData;
