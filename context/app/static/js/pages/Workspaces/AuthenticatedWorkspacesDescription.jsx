import React, { useContext } from 'react';

import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import { AppContext } from 'js/components/Providers';
import Description from 'js/shared-styles/sections/Description';
import WorkspacesList from 'js/components/workspaces/WorkspacesList';

function AuthenticatedWorkspacesDescription() {
  const { workspacesToken } = useContext(AppContext);

  if (!workspacesToken) {
    return (
      <Description padding="20px">
        The workspaces token was not set when you logged in.{' '}
        <OutboundLink href="https://github.com/hubmapconsortium/user_workspaces_server/issues/58">
          Github issue
        </OutboundLink>
      </Description>
    );
  }

  return (
    <>
      <Description padding="20px">
        {/*
          TODO: Add links below.
          TODO: Not all of these entry points will be functional on first release. Update text accordingly.
        */}
        Workspaces are provided through Jupyter notebooks. Navigate to a dataset, collection, dataset search or My Lists
        page to begin a new workspace.
      </Description>
      <WorkspacesList />
    </>
  );
}

export default AuthenticatedWorkspacesDescription;
