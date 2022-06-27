import React, { useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { AppContext } from 'js/components/Providers';
import { DeleteIcon, AddIcon } from 'js/shared-styles/icons';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';

import { createNotebookWorkspace } from './utils';
import { useWorkspacesList } from './hooks';
import { StyledButton } from './style';

function WorkspacesList() {
  const { workspacesEndpoint, workspacesToken } = useContext(AppContext);
  const { workspacesList } = useWorkspacesList();

  async function handleDelete() {
    // TODO: Put up modal and get user input.
    // TODO: Update workspacesList
    // Waiting on delete to be implemented.
  }

  async function handleCreate() {
    // TODO: Put up modal and get user input.
    // TODO: Update workspacesList

    createNotebookWorkspace({
      workspacesEndpoint,
      workspacesToken,
      workspaceName: 'Workspace Timestamp',
      workspaceDescription: 'TODO: description',
      notebookContent: 'TODO',
    });
  }

  return (
    <>
      <SpacedSectionButtonRow
        leftText={<Typography variant="subtitle1">[TODO: Count] Workspaces</Typography>}
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
        {`TODO: Use token "${workspacesToken}" with "${workspacesEndpoint}"`}
        <hr />
        {JSON.stringify(workspacesList)}
      </Paper>
    </>
  );
}

export default WorkspacesList;
