import React, { useContext } from 'react';

import { AppContext } from 'js/components/Providers';
import { LightBlueLink } from 'js/shared-styles/Links';
import { condenseJobs, startJob } from './utils';

function JobDetails({ workspace, jobs }) {
  const { workspacesEndpoint, workspacesToken } = useContext(AppContext);

  function createHandleStart(workspaceId) {
    async function handleStart() {
      startJob({ workspaceId, workspacesEndpoint, workspacesToken });
    }
    return handleStart;
  }

  const job = condenseJobs(jobs);

  return (
    <div>
      <div>
        <b>{workspace.name}</b>
      </div>
      {job.allowNew && (
        <button onClick={createHandleStart(workspace.id)} type="button">
          Start Jupyter
        </button>
      )}
      <JobDetailsDetails job={job} />
    </div>
  );
}

function JobDetailsDetails({ job }) {
  if (!job.status) {
    return null;
  }
  if (job.url) {
    return <LightBlueLink href={job.url}>Status: {job.status}</LightBlueLink>;
  }
  return `Status: ${job.status}`;
}

export default JobDetails;
