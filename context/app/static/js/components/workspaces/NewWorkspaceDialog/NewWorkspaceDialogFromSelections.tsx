import React from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import SvgIcon from '@mui/material/SvgIcon';

import NewWorkspaceDialog from 'js/components/workspaces/NewWorkspaceDialog';
import ErrorOrWarningMessages from 'js/shared-styles/alerts/ErrorOrWarningMessages';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';
import WorkspacesIcon from 'assets/svg/workspaces.svg';
import { useCreateWorkspaceDatasets, useCreateWorkspaceForm } from './useCreateWorkspaceForm';
import RemoveProtectedDatasetsFormField from '../RemoveProtectedDatasetsFormField';

function NewWorkspaceDialogFromSelections() {
  const { errorMessages, warningMessages, selectedRows, ...restWorkspaceDatasets } = useCreateWorkspaceDatasets();
  const { deselectRows } = useSelectableTableStore();

  const { control, errors, setDialogIsOpen, ...rest } = useCreateWorkspaceForm({});

  return (
    <>
      <MenuItem onClick={() => setDialogIsOpen(true)}>
        <SvgIcon component={WorkspacesIcon} sx={{ mr: 1, fontSize: '1.25rem' }} />
        Create New Workspace
      </MenuItem>
      <NewWorkspaceDialog
        datasetUUIDs={selectedRows}
        control={control}
        errors={errors}
        errorMessages={errorMessages}
        removeDatasets={deselectRows}
        {...rest}
      >
        <Box>
          <ErrorOrWarningMessages errorMessages={errorMessages} warningMessages={warningMessages} />
          <RemoveProtectedDatasetsFormField control={control} {...restWorkspaceDatasets} />
        </Box>
      </NewWorkspaceDialog>
    </>
  );
}

export default NewWorkspaceDialogFromSelections;
