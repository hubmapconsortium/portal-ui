import { useState, useEffect, useContext } from 'react';
import { getAuthHeader, getDefaultElasticSearchQuery } from 'js/helpers/functions';
import { AppContext } from 'js/components/Providers';

async function fetchSearchData(query, elasticsearchEndpoint, nexusToken, useDefaultQuery = true) {
  const authHeader = getAuthHeader(nexusToken);
  const response = await fetch(elasticsearchEndpoint, {
    method: 'POST',
    body: JSON.stringify(useDefaultQuery ? getDefaultElasticSearchQuery(query) : query),
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
  const { elasticsearchEndpoint, nexusToken } = useContext(AppContext);

  useEffect(() => {
    async function getAndSetSearchHits() {
      const results = await fetchSearchData(query, elasticsearchEndpoint, nexusToken, useDefaultQuery);
      setSearchData(results);
      setIsLoading(false);
    }
    getAndSetSearchHits();
  }, [elasticsearchEndpoint, nexusToken, query, useDefaultQuery]);

  return { searchData, isLoading };
}

function useSearchHits(query, useDefaultQuery) {
  const { searchData, isLoading } = useSearchData(query, useDefaultQuery);
  const searchHits = searchData?.hits?.hits || [];
  return { searchHits, isLoading };
}

export { fetchSearchData, useSearchHits };
export default useSearchData;
