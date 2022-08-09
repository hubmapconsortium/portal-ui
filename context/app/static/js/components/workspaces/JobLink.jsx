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
      // TODO: Open new tab
      // eslint-disable-next-line no-alert
      alert('TODO: Open a new tab that will poll until the job is started.');
    }
    return handleStart;
  }

  if (job.allowNew) {
    const handleStart = createHandleStart(workspace.id);
    return (
      <OutboundIconLink>
        <LinkButton onClick={handleStart}>{children}</LinkButton>
      </OutboundIconLink>
    );
  }
  if (job?.url) {
    return <OutboundIconLink href={job.url}>{children}</OutboundIconLink>;
  }
  return children;
}

export default JobLink;
