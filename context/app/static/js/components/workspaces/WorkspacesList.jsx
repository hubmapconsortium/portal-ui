import React, { useContext, useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

import { AppContext } from 'js/components/Providers';
import { DeleteIcon, AddIcon } from 'js/shared-styles/icons';
import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';

import { SeparatedFlexRow, FlexBottom } from './style';
import { createNotebookWorkspace } from './utils';

// TODO: Copy-and-paste from SummaryData/style
const StyledButton = styled(WhiteBackgroundIconButton)`
  height: 36px;
`;

function useWorkspacesList() {
  const [workspacesList, setWorkspacesList] = useState([]);
  // TODO: isLoading:
  // const [isLoading, setIsLoading] = useState(true);

  const { workspacesEndpoint, workspacesToken } = useContext(AppContext);

  useEffect(() => {
    async function getAndSetWorkspacesList() {
      const response = await fetch(`${workspacesEndpoint}/workspaces`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'UWS-Authorization': `Token ${workspacesToken}`,
        },
      });

      if (!response.ok) {
        console.error('Workspaces API failed', response);
        return;
      }

      // Response structure documented here:
      //   https://docs.google.com/document/d/1W6qJkLoKMqxYtB1p7CpAo-XBkUqCMtTLnT9DogpUErc/edit
      // (Would prefer documentation in repo or on openAPI.)
      //
      // API does not support CORS:
      //   https://github.com/hubmapconsortium/user_workspaces_server/issues/30
      const results = await response.json();

      setWorkspacesList(results);
      // TODO:
      // setIsLoading(false);
    }
    getAndSetWorkspacesList();
  }, [workspacesEndpoint, workspacesToken]);

  return { workspacesList };
}

function WorkspacesList() {
  const { workspacesEndpoint, workspacesToken } = useContext(AppContext);
  const { workspacesList } = useWorkspacesList();

  async function handleDelete() {
    // TODO: Put up modal and get user input.
    // TODO: Update workspacesList
    // Waiting on delete to be documented:
    // https://github.com/hubmapconsortium/user_workspaces_server/issues/36
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
      <SeparatedFlexRow>
        <Typography variant="subtitle1">[TODO: Count] Workspaces</Typography>
        <FlexBottom>
          <StyledButton onClick={handleDelete}>
            <DeleteIcon color="primary" />
          </StyledButton>
          <StyledButton onClick={handleCreate}>
            <AddIcon color="primary" />
          </StyledButton>
        </FlexBottom>
      </SeparatedFlexRow>
      <Paper>
        {
          // eslint-disable-next-line no-undef
          `TODO: Use token "${workspacesToken}" with "${workspacesEndpoint}"`
        }
        <hr />
        {JSON.stringify(workspacesList)}
      </Paper>
    </>
  );
}

export default WorkspacesList;
