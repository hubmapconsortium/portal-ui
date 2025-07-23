import { useAppContext } from 'js/components/Contexts';
import { fetcher } from 'js/helpers/swr';
import useSWR from 'swr';

interface DatasetPermissionsRequest {
  url: string;
  data: string[];
  groupsToken: string;
}

interface DatasetPermission {
  access_allowed: boolean;
  valid_id: boolean;
  uuid: string;
  hubmap_id: string;
  entity_type: string;
  file_system_path: string;
}

export type DatasetPermissionsResponse = Record<string, DatasetPermission>;

export async function fetchDatasetPermissions({ url, data, groupsToken }: DatasetPermissionsRequest) {
  return fetcher<DatasetPermissionsResponse>({
    url: `${url}/entities/accessible-data-directories`,
    requestInit: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${groupsToken}`,
      },
      body: JSON.stringify(data),
    },
  });
}

function useDatasetAccessInternal(uuids: string[]) {
  const { groupsToken, softAssayEndpoint } = useAppContext();

  const shouldFetch = Boolean(uuids.length && softAssayEndpoint && groupsToken);

  const { data, isLoading } = useSWR(shouldFetch ? ['dataset-access', uuids.sort(), groupsToken] : null, () =>
    fetchDatasetPermissions({
      url: softAssayEndpoint,
      data: uuids,
      groupsToken,
    }),
  );

  return {
    accessibleDatasets: data ?? {},
    isLoading,
  };
}

export function useDatasetsAccess(uuids: string[]) {
  const { accessibleDatasets, isLoading } = useDatasetAccessInternal(uuids);

  return {
    accessibleDatasets,
    isLoading,
  };
}

export function useDatasetAccess(uuid: string) {
  const { accessibleDatasets, isLoading } = useDatasetAccessInternal([uuid]);

  return {
    accessAllowed: accessibleDatasets[uuid]?.access_allowed ?? false,
    isLoading,
  };
}
