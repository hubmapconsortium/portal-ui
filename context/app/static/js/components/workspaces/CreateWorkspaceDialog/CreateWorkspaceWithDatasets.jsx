import React from 'react';
import Button from '@mui/material/Button';

import WorkspaceField from 'js/components/workspaces/WorkspaceField';
import Box from '@mui/material/Box';

import { useSnackbarActions } from 'js/shared-styles/snackbars';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider/store';

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
  const protectedRows = useDatasetsAccessLevel(selectedRows.size > 0 ? [...selectedRows] : []).datasets;
  const containsProtectedDataset = protectedRows.length > 0;

  const errorMessages = [];

  if (selectedRows.size > 10) {
    errorMessages.push(errorHelper.datasets(selectedRows));
  }

  if (containsProtectedDataset) {
    const protectedRowsError =
      protectedRows.length === 1 ? errorHelper.protectedDataset : errorHelper.protectedDatasets;
    errorMessages.push(protectedRowsError(protectedRows));
  }
  const protectedHubmapIds = protectedRows?.map((row) => row._source.hubmap_id).join(', ');

  const removeProtectedDatasets = () => {
    deselectRows(protectedRows.map((r) => r._id));
    toastSuccess('Protected datasets successfully removed from selection.');
  };

  const renderAdditionalFields = ({ control, errors }) => {
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
  };

  return (
    <CreateWorkspaceDialog errorMessages={errorMessages} renderAdditionalFields={renderAdditionalFields} {...rest} />
  );
}
