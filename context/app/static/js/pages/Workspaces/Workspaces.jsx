import React, { useContext } from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';

import { ReactComponent as WorkspacesIcon } from 'assets/svg/workspaces.svg';
import { AppContext } from 'js/components/Providers';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import Description from 'js/shared-styles/sections/Description';
import { LightBlueLink } from 'js/shared-styles/Links';
import WorkspacesAuthenticated from 'js/components/workspaces/WorkspacesAuthenticated';

function Workspaces() {
  const { isAuthenticated } = useContext(AppContext);
  return (
    <>
      <SectionHeader variant="h1" component="h1">
        <SvgIcon component={WorkspacesIcon} /> My Workspaces
      </SectionHeader>
      {!isAuthenticated ? (
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
