import { useState, useEffect, useContext } from 'react';
import { getAuthHeader, getDefaultElasticSearchQuery } from 'js/helpers/functions';
import { AppContext } from 'js/components/Providers';

async function fetchSearchData(query, elasticsearchEndpoint, nexusToken) {
  const authHeader = getAuthHeader(nexusToken);
  const response = await fetch(elasticsearchEndpoint, {
    method: 'POST',
    body: JSON.stringify(getDefaultElasticSearchQuery(query)),
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

function useSearchData(query) {
  const [searchData, setSearchData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { elasticsearchEndpoint, nexusToken } = useContext(AppContext);

  useEffect(() => {
    async function getAndSetSearchHits() {
      const results = await fetchSearchData(query, elasticsearchEndpoint, nexusToken);
      setSearchData(results);
      setIsLoading(false);
    }
    getAndSetSearchHits();
  }, [elasticsearchEndpoint, nexusToken, query]);

  return { searchData, isLoading };
}

function useSearchHits(query) {
  const { searchData, isLoading } = useSearchData(query);
  const searchHits = searchData?.hits?.hits || [];
  return { searchHits, isLoading };
}

export { fetchSearchData, useSearchHits };
export default useSearchData;
