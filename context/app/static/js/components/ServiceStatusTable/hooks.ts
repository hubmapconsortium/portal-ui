import { useState, useEffect } from 'react';

export interface ServiceResponse {
  build?: string;
  version?: string;
  [key: string]: unknown;
}

export interface GatewayStatusResponse {
  file_assets: ServiceResponse;
  cells_api: ServiceResponse;
  data_products_api: ServiceResponse;
  entity_api: ServiceResponse;
  gateway: ServiceResponse;
  ingest_api: ServiceResponse;
  scfind_api: ServiceResponse;
  search_api: ServiceResponse;
  uuid_api: ServiceResponse;
  workspaces_api: ServiceResponse;
  ontology_api: ServiceResponse;
  ukv_api: ServiceResponse;
}

function useGatewayStatus(gatewayUrl: string) {
  const [gatewayStatus, setGatewayStatus] = useState<GatewayStatusResponse | undefined>(undefined);
  useEffect(() => {
    async function getAndSetGatewayStatus() {
      const response = await fetch(gatewayUrl);
      if (!response.ok) {
        console.error('Entity API status failed', response);
        return;
      }
      setGatewayStatus((await response.json()) as GatewayStatusResponse);
    }
    void getAndSetGatewayStatus();
  }, [gatewayUrl]);

  return gatewayStatus;
}

export { useGatewayStatus };
