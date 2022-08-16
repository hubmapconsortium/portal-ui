import React, { useContext } from 'react';

import { AppContext } from 'js/components/Providers';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import LinkButton from 'js/shared-styles/buttons/LinkButton';
import { startJob } from './utils';

function JobLink({ workspace, job, typographyVariant, children }) {
  const { workspacesEndpoint, workspacesToken } = useContext(AppContext);

  async function handleStart(workspaceId) {
    startJob({ workspaceId, workspacesEndpoint, workspacesToken });
  }

  if (job.allowNew) {
    return (
      <LinkButton
        linkComponent={OutboundIconLink}
        onClick={() => handleStart(workspace.id)}
        variant={typographyVariant}
      >
        {children}
      </LinkButton>
    );
  }
  if (job?.url) {
    return (
      <OutboundIconLink href={job.url} variant={typographyVariant}>
        {children}
      </OutboundIconLink>
    );
  }
  return children;
}

export default JobLink;
