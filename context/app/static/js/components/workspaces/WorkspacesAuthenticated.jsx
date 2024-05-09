import React from 'react';

import { useAppContext } from 'js/components/Contexts';

import WorkspacesList from './WorkspacesList';

function WorkspacesAuthenticated() {
  const { workspacesToken } = useAppContext();

  if (!workspacesToken) {
    throw Error('The workspaces token request failed at login');
  }

  return <WorkspacesList />;
}

export default WorkspacesAuthenticated;
