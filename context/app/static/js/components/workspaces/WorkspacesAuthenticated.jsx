import React, { useContext } from 'react';

import EmailIconLink from 'js/shared-styles/Links/iconLinks/EmailIconLink';
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
        <p>
          HuBMAP Workspaces are in{' '}
          <OutboundIconLink href="https://github.com/hubmapconsortium/portal-ui/issues/2799">
            beta testing
          </OutboundIconLink>{' '}
          and are provided as Jupyter Notebooks that may be instantiated with code blocks to perform basic and advanced
          operations on user-selected HuBMAP data. Instantiated workspaces can be launched on datasets. Blank workspaces
          can be launched directly from this page.
        </p>
        <p>
          Workspaces should not be used for long-running batch processes. Contact{' '}
          <EmailIconLink email="help@hubmapconsortium.org">help@hubmapconsortium.org</EmailIconLink> for information
          about accessing HuBMAP compute resources.
        </p>
      </Description>
      <WorkspacesList />
    </>
  );
}

export default WorkspacesAuthenticated;
