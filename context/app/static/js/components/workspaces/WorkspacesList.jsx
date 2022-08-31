import React, { useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import Description from 'js/shared-styles/sections/Description';
import { AppContext } from 'js/components/Providers';
import { DeleteIcon, AddIcon } from 'js/shared-styles/icons';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import { PanelWrapper } from 'js/shared-styles/panels';

import WorkspaceDetails from 'js/components/workspaces/WorkspaceDetails';
import { createEmptyWorkspace, deleteWorkspace, stopJobs } from './utils';
import { useWorkspacesList } from './hooks';
import { StyledButton } from './style';

function WorkspacesList() {
  const { workspacesEndpoint, workspacesToken } = useContext(AppContext);
  const { workspacesList } = useWorkspacesList();

  async function handleDelete(workspaceId) {
    deleteWorkspace({ workspaceId, workspacesEndpoint, workspacesToken });
    // TODO: Update list of workspaces
  }

  async function handleStop(workspaceId) {
    stopJobs({ workspaceId, workspacesEndpoint, workspacesToken });
    // TODO: Update list of workspaces
  }

  async function handleCreate() {
    createEmptyWorkspace({
      workspacesEndpoint,
      workspacesToken,
      workspaceName: 'TODO: prompt for name',
      workspaceDescription: 'TODO: description',
    });
    // TODO: Update list of workspaces
  }

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
            <StyledButton onClick={handleCreate}>
              <AddIcon color="primary" />
            </StyledButton>
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
              <WorkspaceDetails workspace={workspace} />
              <div>
                Created {workspace.datetime_created.slice(0, 10)}
                <button
                  type="submit"
                  disabled={workspace.jobs.length > 0 /* TODO: And/or check workspace status? */}
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
