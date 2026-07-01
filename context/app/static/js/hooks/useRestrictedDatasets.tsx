import { useCallback, useMemo } from 'react';
import { useWorkspaceToasts } from 'js/components/workspaces/toastHooks';
import useHubmapIds from 'js/hooks/useHubmapIds';
import { useDatasetsAccess } from 'js/hooks/useDatasetPermissions';

/**
 * Returns a list of dataset UUIDs that the user does not have access to for workspaces or bulk download,
 * along with any datasets whose UUID/HuBMAP ID differs from the originally selected value.
 * @param datasetUUIDs The UUIDs of the datasets to check access for
 */
const EMPTY_RESTRICTED_ROWS: string[] = [];
function useGetRestrictedDatasets(datasetUUIDs: Set<string>) {
  const uuidsArray = useMemo(() => Array.from(datasetUUIDs), [datasetUUIDs]);
  const { accessibleDatasets, isLoading } = useDatasetsAccess(uuidsArray);

  const restrictedRows = useMemo(() => {
    if (isLoading || !accessibleDatasets) return EMPTY_RESTRICTED_ROWS;
    const filtered = uuidsArray.filter((uuid) => !accessibleDatasets[uuid]?.access_allowed);
    return filtered.length > 0 ? filtered : EMPTY_RESTRICTED_ROWS;
  }, [isLoading, accessibleDatasets, uuidsArray]);

  return { restrictedRows, isLoading };
}

interface useRestrictedDatasetsFormProps {
  selectedRows: Set<string>;
  deselectRows?: (uuids: string[]) => void;
  restrictedDatasetsErrorMessage: (restrictedRows: string[]) => string;
}
function useRestrictedDatasetsForm({
  selectedRows,
  deselectRows,
  restrictedDatasetsErrorMessage,
}: useRestrictedDatasetsFormProps) {
  const { toastSuccessRemoveRestrictedDatasets } = useWorkspaceToasts();
  // Restricted rows are those that the current user does not have access to in a workspace or bulk download.
  const { restrictedRows, isLoading } = useGetRestrictedDatasets(selectedRows);

  const { hubmapIds: restrictedHubmapIds } = useHubmapIds(restrictedRows);

  const errorMessages = useMemo(() => {
    if (restrictedHubmapIds.length === 0) return EMPTY_RESTRICTED_ROWS;

    return [restrictedDatasetsErrorMessage(restrictedHubmapIds)];
  }, [restrictedHubmapIds, restrictedDatasetsErrorMessage]);

  const removeRestrictedDatasets = useCallback(() => {
    deselectRows?.(restrictedRows);
    toastSuccessRemoveRestrictedDatasets();
  }, [deselectRows, restrictedRows, toastSuccessRemoveRestrictedDatasets]);

  return {
    errorMessages,
    restrictedHubmapIds,
    removeRestrictedDatasets,
    restrictedRows,
    selectedRows,
    isLoading,
  };
}

export { useRestrictedDatasetsForm, useGetRestrictedDatasets };
