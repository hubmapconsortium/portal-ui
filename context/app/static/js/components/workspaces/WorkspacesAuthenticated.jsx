import React from 'react';
import Typography from '@mui/material/Typography';

import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import { useAppContext } from 'js/components/Contexts';
import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';
import WorkspacesList from './WorkspacesList';

import { StyledDescription } from './style';

function WorkspacesAuthenticated() {
  const { workspacesToken } = useAppContext();

  if (!workspacesToken) {
    throw Error('The workspaces token request failed at login');
  }

  return (
    <>
      <StyledDescription>
        <Typography gutterBottom>
          HuBMAP Workspaces are in{' '}
          <OutboundIconLink href="https://github.com/hubmapconsortium/portal-ui/issues/2799">
            beta testing
          </OutboundIconLink>{' '}
          and are provided as Jupyter Notebooks that may be instantiated with code blocks to perform basic and advanced
          operations on user-selected HuBMAP data. Instantiated workspaces can be launched on datasets. Blank workspaces
          can be launched directly from this page.
        </Typography>
        <Typography>
          Workspaces should not be used for long-running batch processes. <ContactUsLink>Contact us</ContactUsLink> for
          information about accessing HuBMAP compute resources.
        </Typography>
      </StyledDescription>
      <WorkspacesList />
    </>
  );
}

export default WorkspacesAuthenticated;
