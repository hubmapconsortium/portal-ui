import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

import NewWorkspaceDialog from 'js/components/workspaces/NewWorkspaceDialog';
import WorkspaceField from 'js/components/workspaces/WorkspaceField';
import ErrorMessages from 'js/shared-styles/alerts/ErrorMessages';
import useProtectedDatasetsForm from 'js/components/workspaces/NewWorkspaceDialog/useProtectedDatasetsForm';
import { useCreateWorkspaceForm } from './useCreateWorkspaceForm';
import { CreateWorkspaceFormTypes } from './types';

function NewWorkspaceDialogFromSelections() {
  const { errorMessages, protectedHubmapIds, removeProtectedDatasets, protectedRows, selectedRows } =
    useProtectedDatasetsForm();

  const { control, errors, setDialogIsOpen, ...rest } = useCreateWorkspaceForm({});

  return (
    <>
      <MenuItem onClick={() => setDialogIsOpen(true)}>Create New Workspace</MenuItem>
      <NewWorkspaceDialog
        datasetUUIDs={selectedRows}
        control={control}
        errors={errors}
        errorMessages={errorMessages}
        {...rest}
      >
        {protectedHubmapIds.length > 0 && (
          <Box>
            <ErrorMessages errorMessages={errorMessages} />
            <WorkspaceField<CreateWorkspaceFormTypes>
              control={control}
              name="protected-datasets"
              label="Protected Datasets"
              value={protectedHubmapIds}
              error
            />
            <Button sx={{ mt: 1 }} variant="contained" color="primary" onClick={removeProtectedDatasets}>
              Remove Protected Datasets ({protectedRows.length})
            </Button>
          </Box>
        )}
      </NewWorkspaceDialog>
    </>
  );
}

export default NewWorkspaceDialogFromSelections;
