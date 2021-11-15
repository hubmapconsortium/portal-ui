import { useState, useEffect, useContext } from 'react';
import { getAuthHeader, addRestrictionsToQuery } from 'js/helpers/functions';
import { AppContext } from 'js/components/Providers';

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

function useSearchData(query, useDefaultQuery) {
  const [searchData, setSearchData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { elasticsearchEndpoint, groupsToken } = useContext(AppContext);

  useEffect(() => {
    async function getAndSetSearchHits() {
      const results = await fetchSearchData(query, elasticsearchEndpoint, groupsToken, useDefaultQuery);
      setSearchData(results);
      setIsLoading(false);
    }
    getAndSetSearchHits();
  }, [elasticsearchEndpoint, groupsToken, query, useDefaultQuery]);

  return { searchData, isLoading };
}

function useSearchHits(query, useDefaultQuery) {
  const { searchData, isLoading } = useSearchData(query, useDefaultQuery);
  const searchHits = searchData?.hits?.hits || [];
  return { searchHits, isLoading };
}

export { fetchSearchData, useSearchHits };
export default useSearchData;
