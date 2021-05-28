import React from 'react';

function useGatewayStatus(gatewayUrl) {
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
  }, [gatewayUrl]);

  return gatewayStatus;
}

export { useGatewayStatus };
