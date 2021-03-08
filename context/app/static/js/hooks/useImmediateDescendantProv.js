import React, { useState } from 'react';
import { getAuthHeader } from 'js/helpers/functions';

async function getEntityData(hubmapID, elasticsearchEndpoint, nexusToken) {
  const authHeader = getAuthHeader(nexusToken);
  const response = await fetch(elasticsearchEndpoint, {
    method: 'POST',
    body: JSON.stringify({ query: { match: { 'display_doi.keyword': hubmapID } } }),
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
    },
  });
  if (!response.ok) {
    console.error('Search API failed', response);
    return {};
  }
  const results = await response.json();
  // eslint-disable-next-line no-underscore-dangle
  return results.hits.hits[0]._source;
}

function getProvRequest(uuid, entityEndpoint, nexusToken) {
  const headers = getAuthHeader(nexusToken);
  return { url: `${entityEndpoint}/entities/${uuid}/provenance`, options: { headers } };
}

function useImmediateDescendantProv(display_doi, elasticsearchEndpoint, entityEndpoint, nexusToken) {
  const [immediateDescendantsProvData, setImmediateDescendantsProvData] = useState(undefined);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function getAndSetProvData() {
      const hubmapID = display_doi;
      const entityData = await getEntityData(hubmapID, elasticsearchEndpoint, nexusToken);
      const immediateDescendants = entityData?.immediate_descendants;

      const results = await Promise.all(
        immediateDescendants.map((descendant) => {
          const { url, options } = getProvRequest(descendant.uuid, entityEndpoint, nexusToken);
          const result = fetch(url, options).then((res) => res.json());
          return result;
        }),
      );
      setImmediateDescendantsProvData(results);
      setIsLoading(false);
    }
    getAndSetProvData();
  }, [nexusToken, elasticsearchEndpoint, entityEndpoint, display_doi]);
  return { immediateDescendantsProvData, isLoading };
}

async function getImmediateDescendantProv(display_doi, elasticsearchEndpoint, entityEndpoint, nexusToken) {
  const hubmapID = display_doi;
  const entityData = await getEntityData(hubmapID, elasticsearchEndpoint, nexusToken);
  const immediateDescendants = entityData?.immediate_descendants;

  const results = await Promise.all(
    immediateDescendants.map((descendant) => {
      const { url, options } = getProvRequest(descendant.uuid, entityEndpoint, nexusToken);
      const result = fetch(url, options).then((res) => res.json());
      return result;
    }),
  );
  return results;
}

export { getImmediateDescendantProv };
export default useImmediateDescendantProv;
