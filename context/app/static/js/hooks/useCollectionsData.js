import React from 'react';
import { getAuthHeader } from 'js/helpers/functions';

function useCollectionsData(elasticsearchEndpoint, nexusToken) {
  const [collections, setCollections] = React.useState([]);
  React.useEffect(() => {
    async function getAndSetCollectionsData() {
      const authHeader = getAuthHeader(nexusToken);
      const response = await fetch(elasticsearchEndpoint, {
        method: 'POST',
        body: JSON.stringify({ post_filter: { term: { 'entity_type.keyword': 'Collection' } }, size: 10000 }),
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
      const collectionsHits = results.hits.hits;
      setCollections(collectionsHits);
    }
    getAndSetCollectionsData();
  }, [nexusToken, elasticsearchEndpoint]);

  return collections;
}

export default useCollectionsData;
