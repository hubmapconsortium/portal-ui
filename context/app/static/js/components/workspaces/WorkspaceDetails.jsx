import React from 'react';

import { condenseJobs } from './utils';
import JobLink from './JobLink';

function WorkspaceDetails({ workspace }) {
  const job = condenseJobs(workspace.jobs);

  return (
    <b>
      <JobLink workspace={workspace} job={job}>
        {workspace.name}
      </JobLink>
      {' | '}
      <JobStatus job={job} />
    </b>
  );
}

function JobStatus({ job }) {
  if (!job.status) {
    return null;
  }
  return `Status: ${job.status}`;
}

export default WorkspaceDetails;
