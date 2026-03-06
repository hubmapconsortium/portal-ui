import React from 'react';

function useGatewayStatus(gatewayUrl: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [gatewayStatus, setGatewayStatus] = React.useState<Record<string, any> | undefined>(undefined);
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
