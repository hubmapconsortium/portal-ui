import React from 'react';

import EmailIconLink from 'js/shared-styles/Links/iconLinks/EmailIconLink';
import { useAppContext } from 'js/components/Contexts';
import WorkspacesTitle from 'js/components/workspaces/WorkspacesTitle';
import { LightBlueLink } from 'js/shared-styles/Links';
import WorkspacesAuthenticated from 'js/components/workspaces/WorkspacesAuthenticated';
import { StyledDescription } from './style';

function Workspaces() {
  const { isAuthenticated, isWorkspacesUser } = useAppContext();

  if (!isAuthenticated) {
    return (
      <>
        <WorkspacesTitle />
        <StyledDescription>
          The workspaces feature is only available if logged in and is part of the allowed Globus group.{' '}
          <LightBlueLink href="/login">Log in</LightBlueLink> to view saved workspaces or to begin a new workspace.
        </StyledDescription>
      </>
    );
  }

  if (!isWorkspacesUser) {
    return (
      <>
        <WorkspacesTitle />
        <StyledDescription>
          You must be a member of the allowed Globus group to access this feature. Email{' '}
          <EmailIconLink variant="body2" email="help@hubmapconsortium.org">
            help@hubmapconsortium.org
          </EmailIconLink>{' '}
          to gain access.
        </StyledDescription>
      </>
    );
  }

  return (
    <>
      <WorkspacesTitle />
      <WorkspacesAuthenticated />
    </>
  );
}

export default Workspaces;
