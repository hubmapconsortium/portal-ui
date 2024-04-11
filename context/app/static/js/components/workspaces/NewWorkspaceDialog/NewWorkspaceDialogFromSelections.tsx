import React from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';

import NewWorkspaceDialog from 'js/components/workspaces/NewWorkspaceDialog';
import ErrorMessages from 'js/shared-styles/alerts/ErrorMessages';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';
import { useCreateWorkspaceDatasets, useCreateWorkspaceForm } from './useCreateWorkspaceForm';
import RemoveProtectedDatasetsFormField from '../RemoveProtectedDatasetsFormField';

function NewWorkspaceDialogFromSelections() {
  const { errorMessages, selectedRows, ...restWorkspaceDatasets } = useCreateWorkspaceDatasets();
  const { deselectRows } = useSelectableTableStore();

  const { control, errors, setDialogIsOpen, ...rest } = useCreateWorkspaceForm({});

  return (
    <>
      <MenuItem onClick={() => setDialogIsOpen(true)}>Create New Workspace</MenuItem>
      <NewWorkspaceDialog
        datasetUUIDs={selectedRows}
        control={control}
        errors={errors}
        errorMessages={errorMessages}
        removeDatasets={deselectRows}
        {...rest}
      >
        <Box>
          <ErrorMessages errorMessages={errorMessages} />
          <RemoveProtectedDatasetsFormField control={control} {...restWorkspaceDatasets} />
        </Box>
      </NewWorkspaceDialog>
    </>
  );
}

export default NewWorkspaceDialogFromSelections;
