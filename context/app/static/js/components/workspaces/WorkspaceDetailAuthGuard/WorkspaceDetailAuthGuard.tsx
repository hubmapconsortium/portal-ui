import React, { ReactNode } from 'react';

import { useAppContext } from 'js/components/Contexts';
import { WorkspacesLogInAlert, ContactUsForAccess } from 'js/components/workspaces/workspaceMessaging';
import { Alert } from 'js/shared-styles/alerts/Alert';

function WorkspaceDetailAuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isWorkspacesUser } = useAppContext();

  if (!isAuthenticated) {
    return <WorkspacesLogInAlert />;
  }

  if (!isWorkspacesUser) {
    return (
      <Alert severity="info">
        You do not have access to workspaces. Access to workspaces is restricted to HuBMAP members at present.{' '}
        <ContactUsForAccess />
      </Alert>
    );
  }

  return children;
}

export default WorkspaceDetailAuthGuard;
