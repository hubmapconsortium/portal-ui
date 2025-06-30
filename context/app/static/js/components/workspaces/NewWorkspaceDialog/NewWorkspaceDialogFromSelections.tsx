import React from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import { useEventCallback } from '@mui/material/utils';
import ListItemIcon from '@mui/material/ListItemIcon';

import NewWorkspaceDialog from 'js/components/workspaces/NewWorkspaceDialog';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';
import { WorkspacesIcon } from 'js/shared-styles/icons';
import { trackEvent } from 'js/helpers/trackers';
import { WorkspacesEventCategories } from 'js/components/workspaces/types';
import { useCreateWorkspaceDatasets, useCreateWorkspaceForm } from './useCreateWorkspaceForm';
import RemoveProtectedDatasetsFormField from '../RemoveProtectedDatasetsFormField';

function NewWorkspaceDialogFromSelections() {
  const {
    errorMessages,
    warningMessages,
    selectedRows,
    protectedRows,
    protectedHubmapIds,
    removeInaccessibleDatasets,
    ...restWorkspaceDatasets
  } = useCreateWorkspaceDatasets();
  const { deselectRows } = useSelectableTableStore();

  const { control, errors, setDialogIsOpen, removeDatasets, ...rest } = useCreateWorkspaceForm({
    initialProtectedDatasets: protectedHubmapIds,
    initialSelectedDatasets: [...selectedRows],
  });

  const handleClick = useEventCallback(() => {
    trackEvent({
      category: WorkspacesEventCategories.WorkspaceDialog,
      action: 'Open Create Workspace Dialog',
      label: selectedRows,
    });
    setDialogIsOpen(true);
  });

  return (
    <>
      <MenuItem onClick={handleClick}>
        <ListItemIcon>
          <WorkspacesIcon fontSize="1.25rem" color="primary" />
        </ListItemIcon>
        Create New Workspace
      </MenuItem>
      <NewWorkspaceDialog
        control={control}
        errors={errors}
        removeDatasets={(uuids: string[]) => {
          removeDatasets(uuids);
          deselectRows(uuids);
        }}
        {...rest}
      >
        <Box>
          <RemoveProtectedDatasetsFormField
            control={control}
            protectedHubmapIds={protectedHubmapIds}
            removeInaccessibleDatasets={() => {
              removeInaccessibleDatasets();
              removeDatasets(protectedRows);
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
