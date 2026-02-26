import { useCallback, useMemo } from 'react';
import { useWorkspaceToasts } from 'js/components/workspaces/toastHooks';
import useHubmapIds from 'js/hooks/useHubmapIds';
import { useDatasetsAccess, DatasetSwap } from 'js/hooks/useDatasetPermissions';

/**
 * Returns a list of dataset UUIDs that the user does not have access to for workspaces or bulk download,
 * along with any datasets whose UUID/HuBMAP ID differs from the originally selected value.
 * @param datasetUUIDs The UUIDs of the datasets to check access for
 */
function useGetRestrictedDatasets(datasetUUIDs: Set<string>) {
  const uuidsArray = Array.from(datasetUUIDs);
  const { accessibleDatasets, isLoading, swappedDatasets } = useDatasetsAccess(uuidsArray);

  const restrictedRows =
    isLoading || !accessibleDatasets ? [] : uuidsArray.filter((uuid) => !accessibleDatasets[uuid]?.access_allowed);

  return { restrictedRows, isLoading, swappedDatasets };
}

function formatSwapWarningMessage(swaps: DatasetSwap[]): string {
  if (swaps.length === 1) {
    const { originalUuid, actualHubmapId } = swaps[0];
    return `Dataset ${originalUuid} has been updated. Its current identifier is ${actualHubmapId}.`;
  }
  const ids = swaps.map(({ originalUuid }) => originalUuid).join(', ');
  return `${swaps.length} datasets have been updated (${ids}). Their identifiers may have changed.`;
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
  const { restrictedRows, isLoading, swappedDatasets } = useGetRestrictedDatasets(selectedRows);

  const { hubmapIds: restrictedHubmapIds } = useHubmapIds(restrictedRows);

  const errorMessages = useMemo(() => {
    if (restrictedHubmapIds.length === 0) return [];

    return [restrictedDatasetsErrorMessage(restrictedHubmapIds)];
  }, [restrictedHubmapIds, restrictedDatasetsErrorMessage]);

  const warningMessages = useMemo(() => {
    if (swappedDatasets.length === 0) return [];
    return [formatSwapWarningMessage(swappedDatasets)];
  }, [swappedDatasets]);

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
    selectedRows,
    isLoading,
  };
}

export { useRestrictedDatasetsForm, useGetRestrictedDatasets };
