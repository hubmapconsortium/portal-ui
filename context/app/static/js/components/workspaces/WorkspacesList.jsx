import React, { useState } from 'react';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DeleteRounded from '@mui/icons-material/DeleteRounded';
import Checkbox from '@mui/material/Checkbox';

import Description from 'js/shared-styles/sections/Description';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import { useSelectItems } from 'js/hooks/useSelectItems';
import WorkspaceListItem from 'js/components/workspaces/WorkspaceListItem';

import { useWorkspacesList } from './hooks';
import WorkspaceButton from './WorkspaceButton';
import NewWorkspaceDialogFromWorkspaceList from './NewWorkspaceDialog/NewWorkspaceDialogFromWorkspaceList';
import ConfirmDeleteWorkspacesDialog from './ConfirmDeleteWorkspacesDialog';

function WorkspacesList() {
  const { workspacesList, handleDeleteWorkspace, isDeleting } = useWorkspacesList();
  const { selectedItems, toggleItem } = useSelectItems();

  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <ConfirmDeleteWorkspacesDialog
        dialogIsOpen={dialogIsOpen}
        handleClose={() => setDialogIsOpen(false)}
        handleDeleteWorkspace={handleDeleteWorkspace}
        selectedWorkspaceIds={selectedItems}
        workspacesList={workspacesList}
      />
      <SpacedSectionButtonRow
        leftText={
          <Typography variant="subtitle1">
            {workspacesList.length} Workspace{workspacesList.length !== 1 && 's'}
          </Typography>
        }
        buttons={
          <Stack direction="row" gap={1}>
            <WorkspaceButton
              onClick={() => setDialogIsOpen(true)}
              disabled={selectedItems.size === 0 || isDeleting}
              tooltip="Delete selected workspaces"
            >
              <DeleteRounded />
            </WorkspaceButton>
            <NewWorkspaceDialogFromWorkspaceList />
          </Stack>
        }
      />
      {/* Instructed to show 5.5 workspace list items before scrolling. */}
      <Paper sx={{ maxHeight: '435px', overflowY: 'auto' }}>
        {Object.keys(workspacesList).length === 0 ? (
          <Description padding="20px">No workspaces created yet.</Description>
        ) : (
          workspacesList.map((workspace) => (
            /* TODO: Inbound links have fragments like "#workspace-123": Highlight? */
            <WorkspaceListItem
              workspace={workspace}
              key={workspace.id}
              toggleItem={toggleItem}
              selected={selectedItems.has(workspace.id)}
              ToggleComponent={Checkbox}
            />
          ))
        )}
      </Paper>
    </>
  );
}

export default WorkspacesList;
