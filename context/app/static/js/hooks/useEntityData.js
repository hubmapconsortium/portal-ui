import React from 'react';
import { readCookie } from 'js/helpers/functions';

function useEntityData(uuid, elasticsearchEndpoint) {
  const [entity, setEntity] = React.useState(undefined);
  React.useEffect(() => {
    async function getAndSetEntity() {
      const nexus_token = readCookie('nexus_token');
      const response = await fetch(elasticsearchEndpoint, {
        method: 'POST',
        body: JSON.stringify({ query: { ids: { values: [uuid] } } }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${nexus_token}`,
        },
      });
      if (!response.ok) {
        console.error('Search API failed', response);
        return;
      }
      const results = await response.json();
      // eslint-disable-next-line no-underscore-dangle
      const resultEntity = results.hits.hits[0]._source;
      setEntity(resultEntity);
    }
    getAndSetEntity();
  }, [elasticsearchEndpoint, uuid]);

  return entity;
}

export default useEntityData;
