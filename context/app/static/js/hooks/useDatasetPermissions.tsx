import useSWR from 'swr';

import { useAppContext } from 'js/components/Contexts';
import { fetcher } from 'js/helpers/swr';
import { getIDsQuery, getTermClause } from 'js/helpers/queries';
import { Dataset } from 'js/components/types';
import { useSearchHits } from './useSearchData';

type DatasetAccessLevelHit = Pick<Dataset, 'hubmap_id' | 'mapped_dataset_access_level' | 'uuid'>;

function useGetProtectedDatasets(ids: string[]) {
  const query = {
    query: {
      bool: {
        must: [getIDsQuery(ids)],
        must_not: [getTermClause('mapped_data_access_level.keyword', 'Public')],
      },
    },
    _source: ['uuid', 'hubmap_id'],
    size: ids.length,
  };

  const { searchHits } = useSearchHits<DatasetAccessLevelHit>(query);

  const protectedUUIDs = searchHits.map((s) => s._source.uuid);

  return protectedUUIDs;
}

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

  const protectedUUIDs = useGetProtectedDatasets(uuids);

  const shouldFetch = Boolean(protectedUUIDs.length && softAssayEndpoint && groupsToken);

  const { data, isLoading } = useSWR(
    shouldFetch ? ['dataset-access', [...protectedUUIDs].sort(), groupsToken] : null,
    () =>
      fetchDatasetPermissions({
        url: softAssayEndpoint,
        data: protectedUUIDs,
        groupsToken,
      }),
  );

  return {
    accessibleDatasets: shouldFetch
      ? (data ?? {})
      : Object.fromEntries(
          uuids.map((uuid) => [uuid, { access_allowed: !protectedUUIDs.includes(uuid), valid_id: true, uuid }]),
        ),
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
