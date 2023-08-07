import React from 'react';

import SelectableTableProvider from 'js/shared-styles/tables/SelectableTableProvider/store';
import EmailIconLink from 'js/shared-styles/Links/iconLinks/EmailIconLink';
import { useAppContext } from 'js/components/Contexts';
import WorkspacesTitle from 'js/components/workspaces/WorkspacesTitle';
import { InternalLink } from 'js/shared-styles/Links';
import WorkspacesAuthenticated from 'js/components/workspaces/WorkspacesAuthenticated';
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
        You must be a member of the allowed Globus group to access this feature. Email{' '}
        <EmailIconLink variant="body2" email="help@hubmapconsortium.org">
          help@hubmapconsortium.org
        </EmailIconLink>{' '}
        to gain access.
      </StyledDescription>
    );
  }

  return <WorkspacesAuthenticated />;
}

function Workspaces() {
  return (
    <SelectableTableProvider>
      <WorkspacesTitle />
      <WorkspacesContent />
    </SelectableTableProvider>
  );
}

export default Workspaces;
