import { useState, useEffect } from 'react';
import { getAuthHeader } from 'js/helpers/functions';

function useSearchHits(query, elasticsearchEndpoint, nexusToken) {
  const [searchData, setSearchData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getAndSetSearchHits() {
      const authHeader = getAuthHeader(nexusToken);
      const response = await fetch(elasticsearchEndpoint, {
        method: 'POST',
        body: JSON.stringify(query),
        headers: {
          'Content-Type': 'application/json',
          ...authHeader,
        },
      });
      if (!response.ok) {
        console.error('Search API failed', response);
        return;
      }
      const results = await response.json();
      setSearchData(results.hits.hits);
      setIsLoading(false);
    }
    getAndSetSearchHits();
  }, [nexusToken, elasticsearchEndpoint, query]);

  return { searchData, isLoading };
}

export default useSearchHits;
