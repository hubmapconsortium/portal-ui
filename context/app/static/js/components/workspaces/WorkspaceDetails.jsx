import React from 'react';

import { condenseJobs } from './utils';
import JobLink from './JobLink';
import JobStatus from './JobStatus';
import { Bold } from './style';

function WorkspaceDetails({ workspace }) {
  const job = condenseJobs(workspace.jobs);

  return (
    <Bold>
      <JobLink workspace={workspace} job={job}>
        {workspace.name}
      </JobLink>
      {' | '}
      <JobStatus job={job} />
    </Bold>
  );
}

export default WorkspaceDetails;
