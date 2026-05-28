import { useEffect } from 'react';
import { trackEvent } from 'js/helpers/trackers';
import { EXCESSIVE_NUMBER_OF_WORKSPACE_DATASETS, MAX_NUMBER_OF_WORKSPACE_DATASETS } from 'js/components/workspaces/api';
import { WorkspacesEventCategories } from 'js/components/workspaces/types';
import { useRestrictedDatasetsForm } from 'js/hooks/useRestrictedDatasets';
import { errorHelper, restrictedDatasetsErrorMessage } from 'js/components/workspaces/workspaceDatasetMessaging';

function useWorkspacesRestrictedDatasetsForm({
  selectedRows,
  deselectRows,
}: {
  selectedRows: Set<string>;
  deselectRows?: (rowKeys: string[]) => void;
}) {
  return useRestrictedDatasetsForm({
    selectedRows,
    deselectRows,
    restrictedDatasetsErrorMessage,
  });
}

function useTooManyDatasetsErrors({ numWorkspaceDatasets }: { numWorkspaceDatasets: number }) {
  const errorMessages = [];
  const tooMany = numWorkspaceDatasets > MAX_NUMBER_OF_WORKSPACE_DATASETS;
  if (tooMany) {
    errorMessages.push(errorHelper.maxDatasets(numWorkspaceDatasets));
  }

  // Report the "too many" event once per transition from below-the-limit to
  // above-the-limit, rather than on every render that's over.
  useEffect(() => {
    if (!tooMany) return;
    trackEvent({
      category: WorkspacesEventCategories.Workspaces,
      action: 'Create Workspace / Too many datasets selected',
      value: numWorkspaceDatasets,
    });
  }, [tooMany, numWorkspaceDatasets]);

  return errorMessages;
}

function useTooManyDatasetsWarnings({ numWorkspaceDatasets }: { numWorkspaceDatasets: number }) {
  const warningMessages = [];
  if (numWorkspaceDatasets > EXCESSIVE_NUMBER_OF_WORKSPACE_DATASETS) {
    warningMessages.push(errorHelper.excessiveDatasets());
  }

  return warningMessages;
}

export { useWorkspacesRestrictedDatasetsForm, useTooManyDatasetsErrors, useTooManyDatasetsWarnings };
