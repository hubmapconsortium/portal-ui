import React from 'react';

function useEntityApiStatus() {
  const [entityApiStatus, setEntityApiStatus] = React.useState(undefined);
  React.useEffect(() => {
    async function getAndSetEntityApiStatus() {
      const response = await fetch('https://entity.api.hubmapconsortium.org/status');
      if (!response.ok) {
        console.error('Entity API status failed', response);
        return;
      }
      setEntityApiStatus(await response.json());
    }
    getAndSetEntityApiStatus();
  }, []);

  return entityApiStatus;
}

export { useEntityApiStatus };
