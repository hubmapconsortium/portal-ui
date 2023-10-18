import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import Description from 'js/shared-styles/sections/Description';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';

import WorkspaceListItem from 'js/components/workspaces/WorkspaceListItem';
import DeleteRounded from '@mui/icons-material/DeleteRounded';
import AddRounded from '@mui/icons-material/AddRounded';
import Stack from '@mui/material/Stack';
import { useWorkspacesList } from './hooks';
import WorkspaceButton from './WorkspaceButton';

function WorkspacesList() {
  const { workspacesList, handleCreateWorkspace } = useWorkspacesList();

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
              onClick={() => {
                // eslint-disable-next-line no-alert
                alert('TODO: Support deletion of multiple datasets');
              }}
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
            <WorkspaceListItem workspace={workspace} key={workspace.id} />
          ))
        )}
      </Paper>
    </>
  );
}

export default WorkspacesList;
