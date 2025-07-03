import { useCallback, useRef } from 'react';
import { SearchHit } from '@elastic/elasticsearch/lib/api/types';
import { Dataset } from 'js/components/types';
import { useWorkspaceToasts } from 'js/components/workspaces/toastHooks';
import { getIDsQuery, getTermClause } from 'js/helpers/queries';
import { useSearchHits } from 'js/hooks/useSearchData';
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
    _source: ['uuid', 'hubmap_id'],
    size: ids.length,
  };

  const { searchHits } = useSearchHits(query) as { searchHits: DatasetAccessLevelHits };

  const { protectedHubmapIds, protectedRows } = searchHits.reduce(
    (acc, { _source }) => {
      if (typeof _source?.hubmap_id === 'string') {
        acc.protectedHubmapIds.push(_source.hubmap_id);
      }
      if (typeof _source?.uuid === 'string') {
        acc.protectedRows.push(_source.uuid);
      }
      return acc;
    },
    { protectedHubmapIds: [] as string[], protectedRows: [] as string[] },
  );

  return { protectedHubmapIds, protectedRows };
}

/**
 * Returns true if the user can access the given dataset for workspaces and bulk data downloads, false if they cannot.
 * @param datasetUUID The UUID of the dataset to check access for
 */
function useCheckDatasetAccess() {
  // TODO: this logic is a placeholder. Update this once workspaces API makes access checks available.
  const checkDatasetAccess = (datasetUUID: string) => datasetUUID !== '';

  return checkDatasetAccess;
}

/**
 * Returns a list of dataset UUIDs that the user does not have access to for workspaces or bulk download.
 * @param datasetUUIDs The UUIDs of the datasets to check access for
 * @returns A list of restricted dataset UUIDs
 */
function useGetRestrictedDatasets(datasetUUIDs: Set<string>) {
  const checkDatasetAccess = useCheckDatasetAccess();
  const protectedDatasetUUIDs = [...datasetUUIDs].filter((uuid) => !checkDatasetAccess(uuid));

  return protectedDatasetUUIDs;
}

interface useRestrictedDatasetsFormProps {
  selectedRows: Set<string>;
  deselectRows?: (uuids: string[]) => void;
  restrictedDatasetsErrorMessage: (restrictedRows: string[]) => string;
  protectedDatasetsWarningMessage: (protectedRows: string[]) => string;
  trackEventHelper: (numProtectedDatasets: number) => void;
}
function useRestrictedDatasetsForm({
  selectedRows,
  deselectRows,
  restrictedDatasetsErrorMessage,
  protectedDatasetsWarningMessage,
  trackEventHelper,
}: useRestrictedDatasetsFormProps) {
  const { toastSuccessRemoveRestrictedDatasets } = useWorkspaceToasts();
  // Restricted rows are those that the current user does not have access to in a workspace or bulk download.
  const restrictedRows = useGetRestrictedDatasets(selectedRows);
  // Protected rows are those that have a mapped data access level other than 'Public' (which any user may or
  // may not have access to depending on their group permissions).
  const { protectedHubmapIds, protectedRows } = useGetProtectedDatasets(selectedRows.size > 0 ? [...selectedRows] : []);
  const { hubmapIds: restrictedHubmapIds } = useHubmapIds(restrictedRows);

  const reportedRestrictedRows = useRef(false);
  const errorMessages = [];
  const warningMessages = [];

  if (restrictedHubmapIds.length > 0) {
    errorMessages.push(restrictedDatasetsErrorMessage(restrictedHubmapIds));
    if (!reportedRestrictedRows.current) {
      reportedRestrictedRows.current = true;
      trackEventHelper(restrictedHubmapIds.length);
    }
  }

  if (protectedRows.length > 0) {
    warningMessages.push(protectedDatasetsWarningMessage(protectedHubmapIds));
  }

  const removeRestrictedDatasets = useCallback(() => {
    deselectRows?.(restrictedRows);
    toastSuccessRemoveRestrictedDatasets();
  }, [deselectRows, restrictedRows, toastSuccessRemoveRestrictedDatasets]);

  return {
    errorMessages,
    warningMessages,
    restrictedHubmapIds,
    removeRestrictedDatasets,
    restrictedRows,
    protectedRows,
    selectedRows,
  };
}

export { useRestrictedDatasetsForm, useCheckDatasetAccess };
