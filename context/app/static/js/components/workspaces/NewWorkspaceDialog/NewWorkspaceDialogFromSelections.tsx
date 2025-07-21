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
import RemoveRestrictedDatasetsFormField from '../RemoveRestrictedDatasetsFormField';

function NewWorkspaceDialogFromSelections() {
  const {
    errorMessages: datasetsErrorMessages,
    warningMessages: datasetsWarningMessages,
    selectedRows,
    restrictedRows,
    restrictedHubmapIds,
    removeRestrictedDatasets,
    ...restWorkspaceDatasets
  } = useCreateWorkspaceDatasets();

  const { deselectRows } = useSelectableTableStore();

  const { control, errors, setDialogIsOpen, removeDatasets, errorMessages, ...rest } = useCreateWorkspaceForm({
    initialRestrictedDatasets: [...restrictedHubmapIds],
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
        errorMessages={datasetsErrorMessages}
        warningMessages={datasetsWarningMessages}
        control={control}
        errors={errors}
        removeDatasets={(uuids: string[]) => {
          removeDatasets(uuids);
          deselectRows(uuids);
        }}
        {...rest}
      >
        <Box>
          <RemoveRestrictedDatasetsFormField
            control={control}
            restrictedHubmapIds={restrictedHubmapIds}
            removeRestrictedDatasets={() => {
              removeRestrictedDatasets();
              removeDatasets(restrictedRows);
            }}
            restrictedRows={restrictedRows}
            {...restWorkspaceDatasets}
          />
        </Box>
      </NewWorkspaceDialog>
    </>
  );
}

export default NewWorkspaceDialogFromSelections;
