import React, { useContext } from 'react';

import { ReactComponent as WorkspacesIcon } from 'assets/svg/workspaces.svg';
import { AppContext } from 'js/components/Providers';
import { LightBlueLink } from 'js/shared-styles/Links';
import IconPageTitle from 'js/shared-styles/pages/IconPageTitle';
import WorkspacesAuthenticated from 'js/components/workspaces/WorkspacesAuthenticated';

import { StyledDescription } from './style';

function Workspaces() {
  const { isAuthenticated, isWorkspacesUser } = useContext(AppContext);
  return (
    <>
      <IconPageTitle icon={WorkspacesIcon}>My Workspaces</IconPageTitle>
      {!(isAuthenticated && isWorkspacesUser) ? (
        <StyledDescription>
          The workspaces feature is only available if logged in. <LightBlueLink href="/login">Log in</LightBlueLink> to
          view saved workspaces or to begin a new workspace.
        </StyledDescription>
      ) : (
        <WorkspacesAuthenticated />
      )}
    </>
  );
}

export default Workspaces;
