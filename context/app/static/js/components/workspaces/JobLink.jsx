import React, { useContext } from 'react';

import { AppContext } from 'js/components/Providers';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import { startJob } from './utils';
import { LinkButton } from './style';

function JobLink({ workspace, job, children }) {
  const { workspacesEndpoint, workspacesToken } = useContext(AppContext);

  function createHandleStart(workspaceId) {
    async function handleStart() {
      startJob({ workspaceId, workspacesEndpoint, workspacesToken });
    }
    return handleStart;
  }

  if (job.allowNew) {
    return (
      <OutboundIconLink>
        <LinkButton onClick={createHandleStart(workspace.id)}>{children}</LinkButton>
      </OutboundIconLink>
    );
  }
  if (job?.url) {
    return <OutboundIconLink href={job.url}>{children}</OutboundIconLink>;
  }
  return children;
}

export default JobLink;
