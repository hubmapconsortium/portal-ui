import React from 'react';

import { getAuthHeader } from 'js/helpers/functions';

function useProvData(uuid, entityEndpoint, groupsToken) {
  const [provData, setProvData] = React.useState(undefined);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function getAndSetProvData() {
      const headers = getAuthHeader(groupsToken);

      const response = await fetch(`${entityEndpoint}/entities/${uuid}/provenance`, { headers });

      if (!response.ok) {
        console.error('Prov API failed', response);
        setIsLoading(false);
        return;
      }
      const responseProvData = await response.json();
      setProvData(responseProvData);
      setIsLoading(false);
    }
    getAndSetProvData();
  }, [groupsToken, entityEndpoint, uuid]);

  return { provData, isLoading };
}

export default useProvData;
