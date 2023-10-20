import React, { useRef } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import DeleteRounded from '@mui/icons-material/DeleteRounded';
import AddRounded from '@mui/icons-material/AddRounded';

import Description from 'js/shared-styles/sections/Description';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';

import WorkspaceListItem from 'js/components/workspaces/WorkspaceListItem';
import { useSelectItems } from 'js/hooks/useSelectItems';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import { useWorkspacesList } from './hooks';
import WorkspaceButton from './WorkspaceButton';

function WorkspacesList() {
  const { workspacesList, handleCreateWorkspace, handleDeleteWorkspace } = useWorkspacesList();

  const { selectedItems, toggleItem } = useSelectItems();
  const { toastError } = useSnackbarActions();

  const isDeleting = useRef(false);

  const handleDeleteSelected = async () => {
    const workspaceIds = [...selectedItems];
    isDeleting.current = true;
    try {
      await Promise.all(workspaceIds.map((workspaceId) => handleDeleteWorkspace(workspaceId)));
    } catch (e) {
      toastError('Error deleting workspaces');
      console.error(e);
    } finally {
      isDeleting.current = false;
    }
  };

  return (
    <>
      <SpacedSectionButtonRow
        leftText={
          <Typography variant="subtitle1">
            {workspacesList.length} Workspace{workspacesList.length !== 1 && 's'}
          </Typography>
        }
        buttons={
          <Stack direction="row" gap={1}>
            <WorkspaceButton
              onClick={handleDeleteSelected}
              disabled={selectedItems.size === 0 || isDeleting.current}
              tooltip="Delete selected workspaces"
            >
              <DeleteRounded />
            </WorkspaceButton>
            <WorkspaceButton onClick={handleCreateWorkspace} tooltip="Create workspace">
              <AddRounded />
            </WorkspaceButton>
          </Stack>
        }
      />
      <Paper>
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
            />
          ))
        )}
      </Paper>
    </>
  );
}

export default WorkspacesList;
