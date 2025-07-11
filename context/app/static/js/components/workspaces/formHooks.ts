import { useCallback, useRef } from 'react';
import { trackEvent } from 'js/helpers/trackers';
import { EXCESSIVE_NUMBER_OF_WORKSPACE_DATASETS, MAX_NUMBER_OF_WORKSPACE_DATASETS } from 'js/components/workspaces/api';
import { WorkspacesEventCategories } from 'js/components/workspaces/types';
import { useRestrictedDatasetsForm } from 'js/hooks/useRestrictedDatasets';
import {
  errorHelper,
  restrictedDatasetsErrorMessage,
  protectedDatasetsWarningMessage,
} from 'js/components/workspaces/workspaceDatasetMessaging';

function useWorkspacesRestrictedDatasetsForm({
  selectedRows,
  deselectRows,
}: {
  selectedRows: Set<string>;
  deselectRows?: (rowKeys: string[]) => void;
}) {
  const trackEventHelper = useCallback((numProtectedRows: number) => {
    trackEvent({
      category: WorkspacesEventCategories.Workspaces,
      action: 'Create Workspace / Protected datasets selected',
      value: numProtectedRows,
    });
  }, []);

  return useRestrictedDatasetsForm({
    selectedRows,
    deselectRows,
    restrictedDatasetsErrorMessage,
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

export { useWorkspacesRestrictedDatasetsForm, useTooManyDatasetsErrors, useTooManyDatasetsWarnings };
