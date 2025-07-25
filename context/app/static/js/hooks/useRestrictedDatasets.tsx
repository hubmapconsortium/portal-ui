import { useCallback, useMemo, useRef } from 'react';
import { useWorkspaceToasts } from 'js/components/workspaces/toastHooks';
import useHubmapIds from 'js/hooks/useHubmapIds';
import { useDatasetsAccess } from 'js/hooks/useDatasetPermissions';

/**
 * Returns a list of dataset UUIDs that the user does not have access to for workspaces or bulk download.
 * @param datasetUUIDs The UUIDs of the datasets to check access for
 * @returns A list of restricted dataset UUIDs
 */
function useGetRestrictedDatasets(datasetUUIDs: Set<string>) {
  const uuidsArray = Array.from(datasetUUIDs);
  const { accessibleDatasets, isLoading } = useDatasetsAccess(uuidsArray);

  const protectedDatasetUUIDs =
    isLoading || !accessibleDatasets ? [] : uuidsArray.filter((uuid) => !accessibleDatasets[uuid]?.access_allowed);

  return protectedDatasetUUIDs;
}

interface useRestrictedDatasetsFormProps {
  selectedRows: Set<string>;
  deselectRows?: (uuids: string[]) => void;
  restrictedDatasetsErrorMessage: (restrictedRows: string[]) => string;
  trackEventHelper: (numProtectedDatasets: number) => void;
}
function useRestrictedDatasetsForm({
  selectedRows,
  deselectRows,
  restrictedDatasetsErrorMessage,
  trackEventHelper,
}: useRestrictedDatasetsFormProps) {
  const { toastSuccessRemoveRestrictedDatasets } = useWorkspaceToasts();
  // Restricted rows are those that the current user does not have access to in a workspace or bulk download.
  const restrictedRows = useGetRestrictedDatasets(selectedRows);
  const { hubmapIds: restrictedHubmapIds } = useHubmapIds(restrictedRows);

  const reportedRestrictedRows = useRef(false);

  const errorMessages = useMemo(() => {
    if (restrictedHubmapIds.length === 0) return [];

    if (!reportedRestrictedRows.current) {
      reportedRestrictedRows.current = true;
      trackEventHelper(restrictedHubmapIds.length);
    }

    return [restrictedDatasetsErrorMessage(restrictedHubmapIds)];
  }, [restrictedHubmapIds, restrictedDatasetsErrorMessage, trackEventHelper]);

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
  };
}

export { useRestrictedDatasetsForm, useGetRestrictedDatasets };
