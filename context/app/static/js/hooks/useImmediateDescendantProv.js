import React, { useState } from 'react';
import { getAuthHeader } from 'js/helpers/functions';

async function getEntityData(hubmapID, elasticsearchEndpoint, groupsToken) {
  const authHeader = getAuthHeader(groupsToken);
  const response = await fetch(elasticsearchEndpoint, {
    method: 'POST',
    body: JSON.stringify({ query: { match: { 'hubmap_id.keyword': hubmapID } } }),
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

  return results.hits.hits[0]._source;
}

function getProvRequest(uuid, entityEndpoint, groupsToken) {
  const headers = getAuthHeader(groupsToken);
  return { url: `${entityEndpoint}/entities/${uuid}/provenance`, options: { headers } };
}

function useImmediateDescendantProv(hubmap_id, elasticsearchEndpoint, entityEndpoint, groupsToken) {
  const [immediateDescendantsProvData, setImmediateDescendantsProvData] = useState(undefined);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function getAndSetProvData() {
      const hubmapID = hubmap_id;
      const entityData = await getEntityData(hubmapID, elasticsearchEndpoint, groupsToken);
      const immediateDescendants = entityData?.immediate_descendants;

      const results = await Promise.all(
        immediateDescendants.map((descendant) => {
          const { url, options } = getProvRequest(descendant.uuid, entityEndpoint, groupsToken);
          const result = fetch(url, options).then((res) => res.json());
          return result;
        }),
      );
      setImmediateDescendantsProvData(results);
      setIsLoading(false);
    }
    getAndSetProvData();
  }, [groupsToken, elasticsearchEndpoint, entityEndpoint, hubmap_id]);
  return { immediateDescendantsProvData, isLoading };
}

async function getImmediateDescendantProv(hubmap_id, elasticsearchEndpoint, entityEndpoint, groupsToken) {
  const hubmapID = hubmap_id;
  const entityData = await getEntityData(hubmapID, elasticsearchEndpoint, groupsToken);
  const immediateDescendants = entityData?.immediate_descendants;

  const results = await Promise.all(
    immediateDescendants.map((descendant) => {
      const { url, options } = getProvRequest(descendant.uuid, entityEndpoint, groupsToken);
      const result = fetch(url, options).then((res) => res.json());
      return result;
    }),
  );
  return results;
}

export { getImmediateDescendantProv };
export default useImmediateDescendantProv;
