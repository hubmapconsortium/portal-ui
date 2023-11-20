import React from 'react';
import Stack from '@mui/material/Stack';

import WorkspacesTitle from 'js/components/workspaces/WorkspacesTitle';
import WorkspacesAuthenticated from 'js/components/workspaces/WorkspacesAuthenticated';
import WorkspacesAuthGuard from 'js/components/workspaces/WorkspacesAuthGuard';
import WorkspaceSessionWarning from 'js/components/workspaces/WorkspaceSessionWarning';

function Workspaces() {
  return (
    <Stack spacing={2} direction="column">
      <WorkspaceSessionWarning />
      <WorkspacesTitle />
      <WorkspacesAuthGuard>
        <WorkspacesAuthenticated />
      </WorkspacesAuthGuard>
    </Stack>
  );
}

export default Workspaces;
