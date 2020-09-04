import React from 'react';

import { getAuthHeader } from 'js/helpers/functions';

function useProvData(uuid, entityEndpoint, nexusToken) {
  const [provData, setProvData] = React.useState(undefined);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function getAndSetProvData() {
      const requestInit = getAuthHeader(nexusToken);

      const response = await fetch(`${entityEndpoint}/entities/${uuid}/provenance`, { headers: requestInit });

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
  }, [nexusToken, entityEndpoint, uuid]);

  return { provData, isLoading };
}

export default useProvData;
