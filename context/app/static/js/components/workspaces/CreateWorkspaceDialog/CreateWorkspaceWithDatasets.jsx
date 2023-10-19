import React, { useCallback, useRef } from 'react';
import Button from '@mui/material/Button';

import WorkspaceField from 'js/components/workspaces/WorkspaceField';
import Box from '@mui/material/Box';

import { useSnackbarActions } from 'js/shared-styles/snackbars';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';

import { trackEvent } from 'js/helpers/trackers';
import CreateWorkspaceDialog from './CreateWorkspaceDialog';
import { useDatasetsAccessLevel } from './hooks';

// Selected rows are a Set, so we must use `.size` to avoid a needless conversion to an array
// Protected rows are an array, so we can use `.length`
const errorHelper = {
  datasets: (selectedRows) =>
    `You have selected ${selectedRows.size} datasets. Workspaces currently only supports up to 10 datasets. Please unselect datasets.`,
  protectedDataset: (protectedRows) =>
    `You have selected a protected dataset (${protectedRows[0]._source.hubmap_id}). Workspaces currently only supports published public datasets. To remove the protected dataset from workspace creation, click the “Remove Protected Datasets” button below or return to the previous screen to manually remove this dataset.`,
  protectedDatasets: (protectedRows) =>
    `You have selected ${protectedRows.length} protected datasets. Workspaces currently only supports published public datasets. To remove protected datasets from this workspace creation, click the “Remove Protected Datasets” button below or return to the previous screen to manually remove those datasets.`,
};

export default function CreateWorkspaceWithDatasetsDialog({ ...rest }) {
  const { selectedRows, deselectRows } = useSelectableTableStore();
  const { toastSuccess } = useSnackbarActions();
  const reportedProtectedRows = useRef(false);
  const reportedTooManyRows = useRef(false);
  const protectedRows = useDatasetsAccessLevel(selectedRows.size > 0 ? [...selectedRows] : []).datasets;
  const containsProtectedDataset = protectedRows.length > 0;

  const errorMessages = [];

  if (selectedRows.size > 10) {
    errorMessages.push(errorHelper.datasets(selectedRows));
    if (!reportedTooManyRows.current) {
      reportedTooManyRows.current = true;
      trackEvent({
        category: 'Workspace Creation',
        action: 'Too many datasets selected',
        value: selectedRows.size,
      });
    }
  }

  if (containsProtectedDataset) {
    const protectedRowsError =
      protectedRows.length === 1 ? errorHelper.protectedDataset : errorHelper.protectedDatasets;
    errorMessages.push(protectedRowsError(protectedRows));
    if (!reportedProtectedRows.current) {
      reportedTooManyRows.current = true;
      trackEvent({
        category: 'Workspace Creation',
        action: 'Protected datasets selected',
        value: protectedRows.map((r) => r._id),
      });
    }
  }
  const protectedHubmapIds = protectedRows?.map((row) => row._source.hubmap_id).join(', ');

  const removeProtectedDatasets = useCallback(() => {
    deselectRows(protectedRows.map((r) => r._id));
    toastSuccess('Protected datasets successfully removed from selection.');
    trackEvent({
      category: 'Workspace Creation',
      action: 'Protected datasets removed',
      value: protectedRows.map((r) => r._id),
    });
  }, [deselectRows, protectedRows, toastSuccess]);

  const renderAdditionalFields = useCallback(
    ({ control, errors }) => {
      if (protectedHubmapIds.length > 0) {
        return (
          <Box>
            <WorkspaceField control={control} name="Protected Datasets" errors={errors} value={protectedHubmapIds} />
            <Button sx={{ marginTop: 1 }} variant="contained" color="primary" onClick={removeProtectedDatasets}>
              Remove Protected Datasets ({protectedRows.length})
            </Button>
          </Box>
        );
      }
      return null;
    },
    [protectedHubmapIds, protectedRows.length, removeProtectedDatasets],
  );

  return (
    <CreateWorkspaceDialog errorMessages={errorMessages} renderAdditionalFields={renderAdditionalFields} {...rest} />
  );
}
