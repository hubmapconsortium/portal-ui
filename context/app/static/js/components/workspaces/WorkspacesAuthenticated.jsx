import React, { useContext } from 'react';

import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import { AppContext } from 'js/components/Providers';
import Description from 'js/shared-styles/sections/Description';
import WorkspacesList from './WorkspacesList';

function WorkspacesAuthenticated() {
  const { workspacesToken } = useContext(AppContext);

  if (!workspacesToken) {
    throw Error('The workspaces token request failed at login');
  }

  return (
    <>
      <Description padding="20px">
        <strong>
          This is a private beta release, with{' '}
          <OutboundIconLink href="https://github.com/hubmapconsortium/portal-ui/issues/2799">
            lots of work
          </OutboundIconLink>{' '}
          still to do.
        </strong>{' '}
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

export default WorkspacesAuthenticated;
