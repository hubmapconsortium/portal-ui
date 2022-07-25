import React, { useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { AppContext } from 'js/components/Providers';
import { DeleteIcon, AddIcon } from 'js/shared-styles/icons';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';

import { createNotebookWorkspace, startJob } from './utils';
import { useWorkspacesList, useJobsList } from './hooks';
import { StyledButton } from './style';
import JobDetails from './JobDetails';

function WorkspacesList() {
  const { workspacesEndpoint, workspacesToken } = useContext(AppContext);
  const { workspacesList } = useWorkspacesList();
  const { jobsList } = useJobsList();

  async function handleDelete() {
    // eslint-disable-next-line no-alert
    alert('TODO: API does not yet support deletion.');
    // TODO: Put up modal and get user input.
    // TODO: Update workspacesList
    // Waiting on delete to be implemented.
  }

  async function handleCreate() {
    // TODO: Put up a better modal and get user input.
    // eslint-disable-next-line no-alert
    const content = prompt('Intial content for notebook');

    createNotebookWorkspace({
      workspacesEndpoint,
      workspacesToken,
      workspaceName: 'Workspace Timestamp',
      workspaceDescription: 'TODO: description',
      notebookContent: content,
    });
    // TODO: Update list on page
  }

  function createHandleStart(workspaceId) {
    async function handleStart() {
      startJob({ workspaceId, workspacesEndpoint, workspacesToken });
    }
    return handleStart;
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
        {workspacesList.map((workspace) => (
          <div key={workspace.id}>
            <details>
              <summary>JSON</summary>
              <pre>{JSON.stringify(workspace, null, 2)}</pre>
            </details>
            <div>
              <b>{workspace.name}</b> | Created {workspace.datetime_created.slice(0, 10)}
            </div>
            <button onClick={createHandleStart(workspace.id)} type="button">
              Start Jupyter
            </button>
          </div>
        ))}
      </Paper>
      <SpacedSectionButtonRow leftText={<Typography variant="subtitle1">Jobs</Typography>} />
      <Paper>
        TODO: The current API responses give us no way to connect Workspaces to Jobs.
        <a href="https://github.com/hubmapconsortium/user_workspaces_server/issues/53">Issue</a>
        {jobsList.map((job) => (
          <JobDetails job={job} />
        ))}
      </Paper>
    </>
  );
}

export default WorkspacesList;
