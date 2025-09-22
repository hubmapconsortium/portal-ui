import useSWR from 'swr';

import { useAppContext } from 'js/components/Contexts';
import { fetcher } from 'js/helpers/swr';
import { getIDsQuery, getTermClause } from 'js/helpers/queries';
import { Dataset } from 'js/components/types';
import { useSearchHits } from './useSearchData';

type DatasetAccessLevelHit = Pick<Dataset, 'hubmap_id' | 'mapped_dataset_access_level' | 'uuid'>;

function useGetNonPublicDatasets(ids: string[]) {
  const query = {
    query: {
      bool: {
        must: [getIDsQuery(ids)],
        must_not: [getTermClause('mapped_data_access_level.keyword', 'Public')],
      },
    },
    _source: false,
    size: ids.length,
  };

  const { searchHits } = useSearchHits<DatasetAccessLevelHit>(query);

  const protectedUUIDs = searchHits.map((s) => s._id);

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

interface UseDatasetAccessReturn {
  accessibleDatasets: DatasetPermissionsResponse;
  isLoading: boolean;
}

function useDatasetAccessInternal(uuids: string[]): UseDatasetAccessReturn {
  const { groupsToken, softAssayEndpoint } = useAppContext();

  const nonPublicUUIDs = useGetNonPublicDatasets(uuids);

  const shouldFetch = Boolean(nonPublicUUIDs.length && softAssayEndpoint && groupsToken);

  const { data, isLoading } = useSWR(
    shouldFetch ? ['dataset-access', [...nonPublicUUIDs].sort(), groupsToken] : null,
    () =>
      fetchDatasetPermissions({
        url: softAssayEndpoint,
        data: nonPublicUUIDs,
        groupsToken,
      }),
  );

  if (shouldFetch) {
    return {
      accessibleDatasets: data ?? {},
      isLoading,
    };
  }

  return {
    accessibleDatasets: Object.fromEntries(
      uuids.map((uuid) => [
        uuid,
        {
          access_allowed: !nonPublicUUIDs.includes(uuid),
          valid_id: true,
          uuid,
          hubmap_id: '',
          entity_type: 'dataset',
          file_system_path: '',
        },
      ]),
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
