import React, { useContext } from 'react';

import { AppContext } from 'js/components/Providers';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import LinkButton from 'js/shared-styles/buttons/LinkButton';
import { startJob } from './utils';

function JobLink({ workspace, job, typographyVariant, children }) {
  const { workspacesEndpoint, workspacesToken } = useContext(AppContext);

  function createHandleStart(workspaceId) {
    async function handleStart() {
      startJob({ workspaceId, workspacesEndpoint, workspacesToken });
      // TODO: Open new tab
      // eslint-disable-next-line no-alert
      alert('TODO: Open a new tab that will poll until the job is started.');
    }
    return handleStart;
  }

  if (job.allowNew) {
    return (
      <LinkButton
        linkComponent={OutboundIconLink}
        onClick={createHandleStart(workspace.id)}
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
