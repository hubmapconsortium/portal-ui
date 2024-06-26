import React, { ReactNode } from 'react';

import { useAppContext } from 'js/components/Contexts';
import { TextItems, LogInAlert, AccessAlert } from '../workspaceMessaging';

function WorkspacesAuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isWorkspacesUser } = useAppContext();

  if (!isAuthenticated) {
    return (
      <TextItems textKey="unauthenticated">
        <LogInAlert />
      </TextItems>
    );
  }

  if (!isWorkspacesUser) {
    return (
      <TextItems textKey="noAccess">
        <AccessAlert />
      </TextItems>
    );
  }

  return children;
}

export default WorkspacesAuthGuard;
