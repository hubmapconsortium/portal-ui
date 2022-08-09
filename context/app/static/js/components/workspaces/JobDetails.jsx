import React, { useContext } from 'react';

import { AppContext } from 'js/components/Providers';
import { LightBlueLink } from 'js/shared-styles/Links';
import { condenseJobs, startJob } from './utils';

function JobDetails({ workspace, jobs }) {
  const job = condenseJobs(jobs);

  return (
    <div>
      <JobLink workspace={workspace} job={job}>
        {workspace.name}
      </JobLink>
      {' | '}
      <JobDetailsDetails job={job} />
    </div>
  );
}

function JobLink({ workspace, job, children }) {
  const { workspacesEndpoint, workspacesToken } = useContext(AppContext);

  function createHandleStart(workspaceId) {
    async function handleStart() {
      startJob({ workspaceId, workspacesEndpoint, workspacesToken });
    }
    return handleStart;
  }

  if (job.allowNew) {
    const handleStart = createHandleStart(workspace.id);
    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <span onClick={handleStart} onKeyPress={handleStart}>
        {children}
      </span>
    );
  }
  if (job?.url) {
    return <LightBlueLink href={job.url}>{children}</LightBlueLink>;
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
