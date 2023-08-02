import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import Description from 'js/shared-styles/sections/Description';
import { DeleteIcon } from 'js/shared-styles/icons';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import { PanelWrapper } from 'js/shared-styles/panels';

import WorkspaceDetails from 'js/components/workspaces/WorkspaceDetails';
import CreateWorkspaceButton from 'js/components/workspaces/CreateWorkspaceButton';
import { useWorkspacesList } from './hooks';
import { StyledButton } from './style';

function WorkspacesList() {
  const {
    workspacesList,
    handleDeleteWorkspace: handleDelete,
    handleCreateWorkspace,
    handleStopWorkspace: handleStop,
    handleStartWorkspace,
  } = useWorkspacesList();

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
            <PanelWrapper key={workspace.id}>
              <WorkspaceDetails workspace={workspace} handleStartWorkspace={handleStartWorkspace} />
              <div>
                Created {workspace.datetime_created.slice(0, 10)}
                <button
                  type="submit"
                  disabled={workspace.jobs.length > 0 || workspace.status === 'deleting'}
                  onClick={() => {
                    handleDelete(workspace.id);
                  }}
                >
                  Delete Workspace
                </button>
                <button
                  type="submit"
                  disabled={workspace.jobs.length === 0}
                  onClick={() => {
                    handleStop(workspace.id);
                  }}
                >
                  Stop Jobs
                </button>
              </div>
            </PanelWrapper>
          ))
        )}
      </Paper>
    </>
  );
}

export default WorkspacesList;
