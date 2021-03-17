import { useState, useEffect } from 'react';
import { getAuthHeader } from 'js/helpers/functions';

function useSearchData(query, elasticsearchEndpoint, nexusToken) {
  const [searchData, setSearchData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getAndSetEntity() {
      const authHeader = getAuthHeader(nexusToken);
      const response = await fetch(elasticsearchEndpoint, {
        method: 'POST',
        body: query,
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
      // eslint-disable-next-line no-underscore-dangle
      const resultEntity = results.hits.hits;
      setSearchData(resultEntity);
      setIsLoading(false);
    }
    getAndSetEntity();
  }, [nexusToken, elasticsearchEndpoint, query]);

  return { searchData, isLoading };
}

export default useSearchData;
