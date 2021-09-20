import { useState, useEffect, useContext } from 'react';
import { getAuthHeader } from 'js/helpers/functions';
import { AppContext } from 'js/components/Providers';

function useSearchData(query) {
  const { elasticsearchEndpoint, nexusToken } = useContext(AppContext);
  const [searchData, setSearchData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const queryCurrent = {};
  Object.assign(queryCurrent, query);
  /* eslint-disable prettier/prettier */
  if (!('bool' in queryCurrent)) {
    queryCurrent.bool = {};
  }
  if (!('must_not' in queryCurrent.bool)) {
    queryCurrent.bool.must_not = {};
  }
  if (!('exists' in queryCurrent.bool.must_not)) {
    queryCurrent.bool.must_not.exists = {};
  }
  if (!('field' in queryCurrent.bool.must_not.exists)) {
    queryCurrent.bool.must_not.exists.field = 'next_revision_uuid';
  } else {
    throw new Error(`Bug: bool.must_not.exists.field already set: ${query}`);
  }
  /* eslint-enable prettier/prettier */

  useEffect(() => {
    async function getAndSetSearchHits() {
      const authHeader = getAuthHeader(nexusToken);
      const response = await fetch(elasticsearchEndpoint, {
        method: 'POST',
        body: JSON.stringify(queryCurrent),
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
  }, [nexusToken, elasticsearchEndpoint, queryCurrent]);

  return { searchData, isLoading };
}

function useSearchHits(query) {
  const { searchData, isLoading } = useSearchData(query);
  const searchHits = searchData?.hits?.hits || {};
  return { searchHits, isLoading };
}

export { useSearchHits };
export default useSearchData;
