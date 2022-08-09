import React, { useContext } from 'react';

import { AppContext } from 'js/components/Providers';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import { condenseJobs, startJob } from './utils';

function JobDetails({ workspace, jobs }) {
  const job = condenseJobs(jobs);

  return (
    <b>
      <JobLink workspace={workspace} job={job}>
        {workspace.name}
      </JobLink>
      {' | '}
      <JobDetailsDetails job={job} />
    </b>
  );
}

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
        <button onClick={handleStart} type="submit" style={{ all: 'unset' }}>
          {children}
        </button>
      </OutboundIconLink>
    );
  }
  if (job?.url) {
    return <OutboundIconLink href={job.url}>{children}</OutboundIconLink>;
  }
  return children;
}

function JobDetailsDetails({ job }) {
  if (!job.status) {
    return null;
  }
  return `Status: ${job.status}`;
}

export default JobDetails;
