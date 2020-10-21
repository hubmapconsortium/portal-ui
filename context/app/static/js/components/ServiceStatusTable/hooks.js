import React from 'react';

function useGatewayStatus() {
  const [gatewayStatus, setGatewayStatus] = React.useState(undefined);
  React.useEffect(() => {
    async function getAndSetGatewayStatus() {
      const response = await fetch('https://gateway.api.hubmapconsortium.org/status.json');
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

export { useGatewayStatus };
