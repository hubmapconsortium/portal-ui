import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import Description from 'js/shared-styles/sections/Description';
import { DeleteIcon } from 'js/shared-styles/icons';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';

import WorkspaceListItem from 'js/components/workspaces/WorkspaceListItem';
import CreateWorkspaceButton from 'js/components/workspaces/CreateWorkspaceButton';
import { useWorkspacesList } from './hooks';
import { StyledButton } from './style';

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
          <>
            <StyledButton
              onClick={() => {
                // eslint-disable-next-line no-alert
                alert('TODO: Support deletion of multiple datasets');
              }}
            >
              <DeleteIcon color="primary" />
            </StyledButton>
            <CreateWorkspaceButton handleCreateWorkspace={handleCreateWorkspace} />
          </>
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
