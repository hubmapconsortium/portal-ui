import { useCallback, useRef } from 'react';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';
import { trackEvent } from 'js/helpers/trackers';
import { EXCESSIVE_NUMBER_OF_WORKSPACE_DATASETS, MAX_NUMBER_OF_WORKSPACE_DATASETS } from 'js/components/workspaces/api';
import { WorkspacesEventCategories } from 'js/components/workspaces/types';
import { DatasetAccessLevelHits, useProtectedDatasetsForm } from 'js/hooks/useProtectedDatasets';

const errorHelper = {
  excessiveDatasets: () =>
    `You have selected over ${EXCESSIVE_NUMBER_OF_WORKSPACE_DATASETS} datasets, which may extend launch time. Workspace will still launch, but reduce your selection for a quicker launch.`,
  maxDatasets: (workspaceDatasets: number) =>
    `You have selected ${workspaceDatasets} datasets. The dataset limit for workspaces is ${MAX_NUMBER_OF_WORKSPACE_DATASETS} datasets. Please reduce your selection.`,
  protectedDataset: (protectedRows: DatasetAccessLevelHits) =>
    `You have selected a protected dataset (${protectedRows[0]?._source?.hubmap_id}). Workspaces currently only supports published public datasets. To remove the protected dataset from workspace creation, click the “Remove Protected Datasets” button below or return to the previous screen to manually remove this dataset.`,
  protectedDatasets: (protectedRows: DatasetAccessLevelHits) =>
    `You have selected ${protectedRows.length} protected datasets. Workspaces currently only supports published public datasets. To remove protected datasets from this workspace creation, click the “Remove Protected Datasets” button below or return to the previous screen to manually remove those datasets.`,
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

  const protectedDatasetsErrorMessage = useCallback((protectedRows: DatasetAccessLevelHits) => {
    if (protectedRows.length === 1) {
      return errorHelper.protectedDataset(protectedRows);
    }
    return errorHelper.protectedDatasets(protectedRows);
  }, []);

  return useProtectedDatasetsForm({
    selectedRows,
    deselectRows,
    protectedDatasetsErrorMessage,
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
