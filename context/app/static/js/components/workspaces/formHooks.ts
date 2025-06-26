import { useCallback, useRef } from 'react';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';
import { trackEvent } from 'js/helpers/trackers';
import { EXCESSIVE_NUMBER_OF_WORKSPACE_DATASETS, MAX_NUMBER_OF_WORKSPACE_DATASETS } from 'js/components/workspaces/api';
import { WorkspacesEventCategories } from 'js/components/workspaces/types';
import { useProtectedDatasetsForm } from 'js/hooks/useProtectedDatasets';

const errorHelper = {
  excessiveDatasets: () =>
    `You have selected over ${EXCESSIVE_NUMBER_OF_WORKSPACE_DATASETS} datasets, which may extend launch time. Workspace will still launch, but reduce your selection for a quicker launch.`,
  maxDatasets: (workspaceDatasets: number) =>
    `You have selected ${workspaceDatasets} datasets. The dataset limit for workspaces is ${MAX_NUMBER_OF_WORKSPACE_DATASETS} datasets. Please reduce your selection.`,
  inaccessibleDataset: (inaccessibleHubmapId: string) =>
    `You have selected a protected dataset (${inaccessibleHubmapId}). Workspaces currently only supports published public datasets. To remove the protected dataset from workspace creation, click the “Remove Protected Datasets” button below or return to the previous screen to manually remove this dataset.`,
  inaccessibleDatasets: (inaccessibleHubmapIds: string[]) =>
    `You have selected ${inaccessibleHubmapIds.length} protected datasets. Workspaces currently only supports published public datasets. To remove protected datasets from this workspace creation, click the “Remove Protected Datasets” button below or return to the previous screen to manually remove those datasets.`,
};

const warningHelper = {
  protectedDataset: (protectedHubmapId: string) =>
    `You have selected a protected dataset (${protectedHubmapId}). Depending on your access level, you may not be able to access this dataset in the workspace. If you do not have access, this dataset will not be linked correctly to your workspace.`,
  protectedDatasets: (protectedHubmapIds: string[]) =>
    `You have selected ${protectedHubmapIds.length} protected datasets. Depending on your access level, you may not be able to access these datasets in the workspace. If you do not have access, these datasets will not be linked correctly to your workspace.`,
};

function useWorkspacesProtectedDatasetsForm() {
  const { selectedRows, deselectRows } = useSelectableTableStore();

  const trackEventHelper = useCallback((numProtectedRows: number) => {
    trackEvent({
      category: WorkspacesEventCategories.Workspaces,
      action: 'Create Workspace / Protected datasets selected',
      value: numProtectedRows,
    });
  }, []);

  const inaccessibleDatasetsErrorMessage = useCallback((inaccessibleHubmapIds: string[]) => {
    if (inaccessibleHubmapIds.length === 1) {
      return errorHelper.inaccessibleDataset(inaccessibleHubmapIds[0]);
    }
    return errorHelper.inaccessibleDatasets(inaccessibleHubmapIds);
  }, []);

  const protectedDatasetsWarningMessage = useCallback((protectedHubmapIds: string[]) => {
    if (protectedHubmapIds.length === 1) {
      return warningHelper.protectedDataset(protectedHubmapIds[0]);
    }
    return warningHelper.protectedDatasets(protectedHubmapIds);
  }, []);

  return useProtectedDatasetsForm({
    selectedRows,
    deselectRows,
    inaccessibleDatasetsErrorMessage,
    protectedDatasetsWarningMessage,
    trackEventHelper,
  });
}

function useTooManyDatasetsErrors({ numWorkspaceDatasets }: { numWorkspaceDatasets: number }) {
  const errorMessages = [];
  const reportedTooManyRows = useRef(false);
  if (numWorkspaceDatasets > MAX_NUMBER_OF_WORKSPACE_DATASETS) {
    errorMessages.push(errorHelper.maxDatasets(numWorkspaceDatasets));
    if (!reportedTooManyRows.current) {
      reportedTooManyRows.current = true;
      trackEvent({
        category: WorkspacesEventCategories.Workspaces,
        action: 'Create Workspace / Too many datasets selected',
        value: numWorkspaceDatasets,
      });
    }
  }

  return errorMessages;
}

function useTooManyDatasetsWarnings({ numWorkspaceDatasets }: { numWorkspaceDatasets: number }) {
  const warningMessages = [];
  if (numWorkspaceDatasets > EXCESSIVE_NUMBER_OF_WORKSPACE_DATASETS) {
    warningMessages.push(errorHelper.excessiveDatasets());
  }

  return warningMessages;
}

export { useWorkspacesProtectedDatasetsForm, useTooManyDatasetsErrors, useTooManyDatasetsWarnings };
