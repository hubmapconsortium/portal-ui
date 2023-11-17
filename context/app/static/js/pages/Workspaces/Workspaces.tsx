import React from 'react';

import WorkspacesTitle from 'js/components/workspaces/WorkspacesTitle';
import WorkspacesAuthenticated from 'js/components/workspaces/WorkspacesAuthenticated';
import WorkspacesAuthGuard from 'js/components/workspaces/WorkspacesAuthGuard';

function Workspaces() {
  return (
    <>
      <WorkspacesTitle />
      <WorkspacesAuthGuard>
        <WorkspacesAuthenticated />
      </WorkspacesAuthGuard>
    </>
  );
}

export default Workspaces;
