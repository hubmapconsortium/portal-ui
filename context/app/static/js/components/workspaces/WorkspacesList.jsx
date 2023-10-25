import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import DeleteRounded from '@mui/icons-material/DeleteRounded';

import Description from 'js/shared-styles/sections/Description';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';

import WorkspaceListItem from 'js/components/workspaces/WorkspaceListItem';
import { useSelectItems } from 'js/hooks/useSelectItems';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import { useWorkspacesList } from './hooks';
import WorkspaceButton from './WorkspaceButton';
import NewWorkspaceDialogFromWorkspaceList from './NewWorkspaceDialog/NewWorkspaceDialogFromWorkspaceList';

function WorkspacesList() {
  const { workspacesList, handleDeleteWorkspace, isDeleting } = useWorkspacesList();

  const { selectedItems, toggleItem } = useSelectItems();
  const { toastError } = useSnackbarActions();

  const handleDeleteSelected = () => {
    const workspaceIds = [...selectedItems];
    Promise.all(workspaceIds.map((workspaceId) => handleDeleteWorkspace(workspaceId))).catch((e) => {
      toastError(`Error deleting workspace: ${e.message}`);
      console.error(e);
    });
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
              disabled={selectedItems.size === 0 || isDeleting}
              tooltip="Delete selected workspaces"
            >
              <DeleteRounded />
            </WorkspaceButton>
            <NewWorkspaceDialogFromWorkspaceList />
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
