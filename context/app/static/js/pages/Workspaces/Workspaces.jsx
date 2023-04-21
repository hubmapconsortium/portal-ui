import React, { useContext } from 'react';

import { ReactComponent as WorkspacesIcon } from 'assets/svg/workspaces.svg';
import { AppContext } from 'js/components/Providers';
import Description from 'js/shared-styles/sections/Description';
import { LightBlueLink } from 'js/shared-styles/Links';
import WorkspacesAuthenticated from 'js/components/workspaces/WorkspacesAuthenticated';

import IconPageTitle from 'js/shared-styles/pages/IconPageTitle';

function Workspaces() {
  const { isAuthenticated, isWorkspacesUser } = useContext(AppContext);
  return (
    <>
      <IconPageTitle icon={WorkspacesIcon}>My Workspaces</IconPageTitle>
      {!(isAuthenticated && isWorkspacesUser) ? (
        <Description padding="20px">
          The workspaces feature is only available if logged in. <LightBlueLink href="/login">Log in</LightBlueLink> to
          view saved workspaces or to begin a new workspace.
        </Description>
      ) : (
        <WorkspacesAuthenticated />
      )}
    </>
  );
}

export default Workspaces;
