import React from 'react';

import { condenseJobs } from './utils';
import JobLink from './JobLink';
import JobStatus from './JobStatus';

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

export default WorkspaceDetails;
