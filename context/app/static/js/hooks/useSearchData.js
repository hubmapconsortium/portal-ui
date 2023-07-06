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

function useSearchData(query, useDefaultQuery, fetcher = fetchSearchData, fallbackData = {}) {
  const { elasticsearchEndpoint, groupsToken } = useAppContext();

  const { data: searchData, isLoading } = useSWR(
    [query, elasticsearchEndpoint, groupsToken, useDefaultQuery],
    (args) => fetcher(...args),
    { fallbackData },
  );

  return { searchData, isLoading };
}

function useSearchHits(query, useDefaultQuery, fetcher = fetchSearchData) {
  const { searchData, isLoading } = useSearchData(query, useDefaultQuery, fetcher, []);
  const searchHits = searchData?.hits?.hits || [];
  return { searchHits, isLoading };
}

export { fetchSearchData, useSearchHits };
export default useSearchData;
