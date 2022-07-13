import React, { useContext } from 'react';

import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import { AppContext } from 'js/components/Providers';
import Description from 'js/shared-styles/sections/Description';
import WorkspacesList from './WorkspacesList';

function AuthenticatedWorkspacesDescription() {
  const { workspacesToken } = useContext(AppContext);

  const contact = (
    <>
      For any problems, notify Juan Puerto in <code>#workspaces</code>.
    </>
  );

  if (!workspacesToken) {
    return (
      <Description padding="20px">
        The workspaces token request failed at login. {contact}{' '}
        <OutboundIconLink href="https://github.com/hubmapconsortium/user_workspaces_server/issues/58">
          Github issue
        </OutboundIconLink>
      </Description>
    );
  }

  return (
    <>
      <Description padding="20px">
        <strong>This is not yet ready for production use! {contact}</strong>{' '}
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
