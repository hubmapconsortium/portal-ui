import React from 'react';

import { useAppContext } from 'js/components/Contexts';
import WorkspacesTitle from 'js/components/workspaces/WorkspacesTitle';
import { InternalLink } from 'js/shared-styles/Links';
import WorkspacesAuthenticated from 'js/components/workspaces/WorkspacesAuthenticated';
import HelpLink from 'js/shared-styles/Links/HelpLink';
import { StyledDescription } from './style';

function WorkspacesContent() {
  const { isAuthenticated, isWorkspacesUser } = useAppContext();

  if (!isAuthenticated) {
    return (
      <StyledDescription>
        The workspaces feature is only available if you are logged in and part of the allowed Globus group.{' '}
        <InternalLink href="/login">Log in</InternalLink> to view saved workspaces or to begin a new workspace.
      </StyledDescription>
    );
  }

  if (!isWorkspacesUser) {
    return (
      <StyledDescription>
        You must be a member of the allowed Globus group to access this feature. Email <HelpLink variant="body2" /> to
        gain access.
      </StyledDescription>
    );
  }

  return <WorkspacesAuthenticated />;
}

function Workspaces() {
  return (
    <>
      <WorkspacesTitle />
      <WorkspacesContent />
    </>
  );
}

export default Workspaces;
