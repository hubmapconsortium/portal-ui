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
          <strong>
            This is a private beta release, with{' '}
            <OutboundIconLink href="https://github.com/hubmapconsortium/portal-ui/issues/2799">
              lots of work
            </OutboundIconLink>{' '}
            still to do.
          </strong>
        </p>
        <p>
          Workspaces are provided through Jupyter notebooks. Currently, beta users can create workspaces from datasets
          with visulizations. Eventually, all users with HuBMAP accounts will be able to create workspaces from any from
          any dataset, collection, dataset search or list.
        </p>
        <p>
          Workspaces should not be used for long-running batch processes. Contact{' '}
          <EmailIconLink variant="body2" email="help@hubmapconsortium.org">
            help@hubmapconsortium.org
          </EmailIconLink>{' '}
          for information about accessing HuBMAP compute resources.
        </p>
      </Description>
      <WorkspacesList />
    </>
  );
}

export default WorkspacesAuthenticated;
