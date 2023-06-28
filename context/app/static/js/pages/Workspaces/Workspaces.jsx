import React from 'react';

import { useAppContext } from 'js/components/Contexts';
import WorkspacesTitle from 'js/components/workspaces/WorkspacesTitle';
import { LightBlueLink } from 'js/shared-styles/Links';
import WorkspacesAuthenticated from 'js/components/workspaces/WorkspacesAuthenticated';

import { StyledDescription } from './style';

function Workspaces() {
  const { isAuthenticated, isWorkspacesUser } = useAppContext();
  return (
    <>
      <WorkspacesTitle />
      {!(isAuthenticated && isWorkspacesUser) ? (
        <StyledDescription>
          The workspaces feature is only available if logged in and is part of the allowed Globus group.{' '}
          <LightBlueLink href="/login">Log in</LightBlueLink> to view saved workspaces or to begin a new workspace.
        </StyledDescription>
      ) : (
        <WorkspacesAuthenticated />
      )}
    </>
  );
}

export default Workspaces;
