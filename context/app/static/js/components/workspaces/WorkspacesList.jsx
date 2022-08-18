import React, { useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import Description from 'js/shared-styles/sections/Description';
import { AppContext } from 'js/components/Providers';
import { DeleteIcon, AddIcon } from 'js/shared-styles/icons';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import { PanelWrapper } from 'js/shared-styles/panels';

import WorkspaceDetails from 'js/components/workspaces/WorkspaceDetails';
import { createEmptyWorkspace, deleteWorkspace } from './utils';
import { useWorkspacesList } from './hooks';
import { StyledButton } from './style';

function WorkspacesList() {
  const { workspacesEndpoint, workspacesToken } = useContext(AppContext);
  const { workspacesList } = useWorkspacesList();

  async function handleDelete(workspaceId) {
    deleteWorkspace({ workspaceId, workspacesEndpoint, workspacesToken });
    // TODO: Handle failed deletion
    // TODO: Update list of workspaces
  }

  async function handleCreate() {
    createEmptyWorkspace({
      workspacesEndpoint,
      workspacesToken,
      workspaceName: 'Workspace Timestamp',
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
            <StyledButton onClick={handleDelete}>
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
                  onClick={() => {
                    handleDelete(workspace.id);
                  }}
                >
                  Delete
                  {/* TODO: Checkbox instead of button. */}
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
