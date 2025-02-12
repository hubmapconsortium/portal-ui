import React from 'react';
import Stack from '@mui/material/Stack';

import { useAppContext } from 'js/components/Contexts';

import WorkspaceInvitations from './WorkspaceInvitations';
import WorkspacesList from './WorkspacesList';

function WorkspacesAuthenticated() {
  const { workspacesToken } = useAppContext();

  if (!workspacesToken) {
    throw Error('The workspaces token request failed at login');
  }

  return (
    <Stack spacing={2}>
      <WorkspaceInvitations />
      <WorkspacesList />
    </Stack>
  );
}

export default WorkspacesAuthenticated;
