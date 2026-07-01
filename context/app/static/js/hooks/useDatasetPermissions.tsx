import { useMemo } from 'react';
import useSWR from 'swr';

import { useAppContext } from 'js/components/Contexts';
import { fetcher } from 'js/helpers/swr';
import { hashUuidSet } from 'js/helpers/swr/keys';
import { getAuthHeader } from 'js/helpers/functions';

const BATCH_SIZE = 10_000;

interface DatasetPermissionsRequest {
  url: string;
  data: string[];
  groupsToken: string;
}

export interface DatasetPermission {
  valid_id: boolean;
  access_allowed?: boolean;
  uuid?: string;
  hubmap_id?: string;
  entity_type?: string;
  file_system_path?: string;
}

export type DatasetPermissionsResponse = Record<string, DatasetPermission>;

export async function fetchDatasetPermissions({ url, data, groupsToken }: DatasetPermissionsRequest) {
  return fetcher<DatasetPermissionsResponse>({
    url: `${url}/entities/accessible-data-directories`,
    requestInit: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(groupsToken),
      },
      body: JSON.stringify(data),
    },
  });
}

async function fetchBatchedDatasetPermissions({
  url,
  data,
  groupsToken,
}: DatasetPermissionsRequest): Promise<DatasetPermissionsResponse> {
  if (data.length === 0) return {};

  if (data.length <= BATCH_SIZE) {
    return fetchDatasetPermissions({ url, data, groupsToken });
  }

  const batches: string[][] = [];
  for (let i = 0; i < data.length; i += BATCH_SIZE) {
    batches.push(data.slice(i, i + BATCH_SIZE));
  }

  const results = await Promise.all(batches.map((batch) => fetchDatasetPermissions({ url, data: batch, groupsToken })));

  return Object.assign({}, ...results) as DatasetPermissionsResponse;
}

interface UseDatasetAccessReturn {
  accessibleDatasets: DatasetPermissionsResponse;
  isLoading: boolean;
}

const EMPTY_PERMISSIONS: DatasetPermissionsResponse = {};

function useDatasetAccessInternal(uuids: string[]): UseDatasetAccessReturn {
  const { groupsToken, softAssayEndpoint } = useAppContext();

  // Use a fast hash for the SWR key instead of joining all UUIDs into a large string.
  // For 15k UUIDs, this avoids creating a ~555KB key string and an O(N log N) sort.
  const swrKey = useMemo(() => {
    if (uuids.length === 0 || !softAssayEndpoint) return null;
    return `dataset-access:${hashUuidSet(uuids)}`;
  }, [uuids, softAssayEndpoint]);

  const { data = EMPTY_PERMISSIONS, isLoading } = useSWR(swrKey, () =>
    fetchBatchedDatasetPermissions({
      url: softAssayEndpoint,
      data: uuids,
      groupsToken,
    }),
  );

  return { accessibleDatasets: data, isLoading };
}

export function useDatasetsAccess(uuids: string[]) {
  return useDatasetAccessInternal(uuids);
}

export function useDatasetAccess(uuid: string) {
  const { accessibleDatasets, isLoading } = useDatasetAccessInternal([uuid]);

  return {
    accessAllowed: accessibleDatasets[uuid]?.access_allowed ?? false,
    isLoading,
  };
}
