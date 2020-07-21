import React from 'react';
import { readCookie } from 'helpers/functions';

function useProvData(uuid, entityEndpoint) {
  const [provData, setProvData] = React.useState(undefined);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function getAndSetProvData() {
      const nexus_token = readCookie('nexus_token');
      const requestInit = nexus_token
        ? {
            headers: {
              Authorization: `Bearer ${nexus_token}`,
            },
          }
        : {};

      const response = await fetch(`${entityEndpoint}/entities/${uuid}/provenance`, requestInit);

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
  }, [entityEndpoint, uuid]);

  return { provData, isLoading };
}

export default useProvData;
