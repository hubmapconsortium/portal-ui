import { useCallback, useRef } from 'react';
import { SearchHit } from '@elastic/elasticsearch/lib/api/types';
import { Dataset } from 'js/components/types';
import { useWorkspaceToasts } from 'js/components/workspaces/toastHooks';
import { getIDsQuery, getTermClause } from 'js/helpers/queries';
import { useSearchHits } from 'js/hooks/useSearchData';
import { useAppContext } from 'js/components/Contexts';
import useHubmapIds from 'js/hooks/useHubmapIds';

export type DatasetAccessLevelHits = SearchHit<Pick<Dataset, 'hubmap_id' | 'mapped_dataset_access_level' | 'uuid'>>[];

function useGetProtectedDatasets(ids: string[]) {
  const query = {
    query: {
      bool: {
        must: [getIDsQuery(ids)],
        must_not: [getTermClause('mapped_data_access_level.keyword', 'Public')],
      },
    },
    _source: ['uuid'],
    size: ids.length,
  };

  const { searchHits } = useSearchHits(query) as { searchHits: DatasetAccessLevelHits };

  const protectedHubmapIds = searchHits
    .map((hit) => hit._source?.uuid)
    .filter((id): id is string => typeof id === 'string');

  return protectedHubmapIds;
}

/**
 * Returns true if the user can access the given dataset in a workspace, false if they cannot.
 * @param datasetUUID The UUID of the dataset to check access for
 */
function useCheckDatasetAccess() {
  const { isWorkspacesUser } = useAppContext();

  // TODO: update this once workspaces API makes access checks available
  const checkDatasetAccess = useCallback(
    (datasetUUID: string) => isWorkspacesUser && datasetUUID !== '',
    [isWorkspacesUser],
  );

  return checkDatasetAccess;
}

/**
 * Returns a list of dataset UUIDs that the user does not have access to for workspaces or bulk download.
 * @param datasetUUIDs The UUIDs of the datasets to check access for
 * @returns A list of inaccessible dataset UUIDs
 */
function useGetInaccessibleDatasets(datasetUUIDs: Set<string>) {
  const checkDatasetAccess = useCheckDatasetAccess();
  const protectedDatasetUUIDs = [...datasetUUIDs].filter((uuid) => !checkDatasetAccess(uuid));

  return protectedDatasetUUIDs;
}

interface useProtectedDatasetsFormProps {
  selectedRows: Set<string>;
  deselectRows?: (uuids: string[]) => void;
  inaccessibleDatasetsErrorMessage: (protectedRows: string[]) => string;
  protectedDatasetsWarningMessage: (protectedRows: string[]) => string;
  trackEventHelper: (numProtectedDatasets: number) => void;
}
function useProtectedDatasetsForm({
  selectedRows,
  deselectRows,
  inaccessibleDatasetsErrorMessage,
  protectedDatasetsWarningMessage,
  trackEventHelper,
}: useProtectedDatasetsFormProps) {
  const { toastSuccessRemoveInaccessibleDatasets } = useWorkspaceToasts();
  // Inaccessible rows are those that the current user does not have access to in a workspace or bulk download.
  const inaccessibleRows = useGetInaccessibleDatasets(selectedRows);
  // Protected rows are those that have a mapped data access level other than 'Public' (which any user might
  // not have access to depending on their group permissions).
  const protectedRows = useGetProtectedDatasets(selectedRows.size > 0 ? [...selectedRows] : []);

  const reportedInaccessibleRows = useRef(false);
  const errorMessages = [];
  const warningMessages = [];

  if (inaccessibleRows.length > 0) {
    errorMessages.push(inaccessibleDatasetsErrorMessage(inaccessibleRows));
    if (!reportedInaccessibleRows.current) {
      reportedInaccessibleRows.current = true;
      trackEventHelper(protectedRows.length);
    }
  }

  if (protectedRows.length > 0) {
    warningMessages.push(protectedDatasetsWarningMessage(protectedRows));
  }

  const { hubmapIds } = useHubmapIds(inaccessibleRows);
  const protectedHubmapIds = hubmapIds.join(', ');

  const removeInaccessibleDatasets = useCallback(() => {
    deselectRows?.(inaccessibleRows);
    toastSuccessRemoveInaccessibleDatasets();
  }, [deselectRows, inaccessibleRows, toastSuccessRemoveInaccessibleDatasets]);

  return {
    errorMessages,
    warningMessages,
    protectedHubmapIds,
    removeInaccessibleDatasets,
    protectedRows,
    selectedRows,
  };
}

export { useProtectedDatasetsForm, useCheckDatasetAccess };
