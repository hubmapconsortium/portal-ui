import React from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import SvgIcon from '@mui/material/SvgIcon';

import NewWorkspaceDialog from 'js/components/workspaces/NewWorkspaceDialog';
import ErrorOrWarningMessages from 'js/shared-styles/alerts/ErrorOrWarningMessages';
import WorkspacesIcon from 'assets/svg/workspaces.svg';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';
import { useCreateWorkspaceDatasets, useCreateWorkspaceForm } from './useCreateWorkspaceForm';
import RemoveProtectedDatasetsFormField from '../RemoveProtectedDatasetsFormField';

function NewWorkspaceDialogFromSelections() {
  const {
    errorMessages,
    warningMessages,
    selectedRows,
    protectedRows,
    protectedHubmapIds,
    removeProtectedDatasets,
    ...restWorkspaceDatasets
  } = useCreateWorkspaceDatasets();
  const { deselectRows } = useSelectableTableStore();

  const { control, errors, setDialogIsOpen, removeDatasets, ...rest } = useCreateWorkspaceForm({
    initialProtectedDatasets: protectedHubmapIds,
    initialSelectedDatasets: [...selectedRows],
  });

  return (
    <>
      <MenuItem onClick={() => setDialogIsOpen(true)}>
        <SvgIcon component={WorkspacesIcon} sx={{ mr: 1, fontSize: '1.25rem' }} color="primary" />
        Create New Workspace
      </MenuItem>
      <NewWorkspaceDialog
        control={control}
        errors={errors}
        errorMessages={errorMessages}
        removeDatasets={(uuids: string[]) => {
          removeDatasets(uuids);
          deselectRows(uuids);
        }}
        {...rest}
      >
        <Box>
          <ErrorOrWarningMessages errorMessages={errorMessages} warningMessages={warningMessages} />
          <RemoveProtectedDatasetsFormField
            control={control}
            protectedHubmapIds={protectedHubmapIds}
            removeProtectedDatasets={() => {
              removeProtectedDatasets();
              removeDatasets(protectedRows.map((r) => r._id));
            }}
            protectedRows={protectedRows}
            {...restWorkspaceDatasets}
          />
        </Box>
      </NewWorkspaceDialog>
    </>
  );
}

export default NewWorkspaceDialogFromSelections;
