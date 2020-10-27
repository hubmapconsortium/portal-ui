import React from 'react';

const gatewayUrl = 'https://gateway.api.hubmapconsortium.org/status.json';

function useGatewayStatus() {
  const [gatewayStatus, setGatewayStatus] = React.useState(undefined);
  React.useEffect(() => {
    async function getAndSetGatewayStatus() {
      const response = await fetch(gatewayUrl);
      if (!response.ok) {
        console.error('Entity API status failed', response);
        return;
      }
      setGatewayStatus(await response.json());
    }
    getAndSetGatewayStatus();
  }, []);

  return gatewayStatus;
}

export { useGatewayStatus, gatewayUrl };
