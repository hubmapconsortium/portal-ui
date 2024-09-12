import React, { ReactNode } from 'react';

import { useAppContext } from 'js/components/Contexts';
import { TextItems, WorkspacesLogInAlert, AccessAlert } from '../workspaceMessaging';

function WorkspacesAuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isWorkspacesUser } = useAppContext();

  if (!isAuthenticated) {
    return (
      <TextItems textKey="workspacesUserOrLoggedOut">
        <WorkspacesLogInAlert />
      </TextItems>
    );
  }

  if (!isWorkspacesUser) {
    return (
      <TextItems textKey="nonWorkspacesUser">
        <AccessAlert />
      </TextItems>
    );
  }

  return children;
}

export default WorkspacesAuthGuard;
