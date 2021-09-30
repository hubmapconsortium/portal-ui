import { useState, useEffect, useContext } from 'react';
import { getAuthHeader } from 'js/helpers/functions';
import { AppContext } from 'js/components/Providers';

function useSearchData(query) {
  const { elasticsearchEndpoint, nexusToken } = useContext(AppContext);
  const [searchData, setSearchData] = useState({});
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
      setSearchData(results);
      setIsLoading(false);
    }
    getAndSetSearchHits();
  }, [nexusToken, elasticsearchEndpoint, query]);

  return { searchData, isLoading };
}

function useSearchHits(query) {
  const { searchData, isLoading } = useSearchData(query);
  const searchHits = searchData?.hits?.hits || [];
  return { searchHits, isLoading };
}

export { useSearchHits };
export default useSearchData;
