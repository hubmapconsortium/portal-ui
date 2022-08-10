import React from 'react';

import { condenseJobs } from 'js/components/workspaces/utils';
import JobLink from 'js/components/workspaces/JobLink';
import JobStatus from 'js/components/workspaces/JobStatus';
import Typography from '@material-ui/core/Typography';
import { Flex } from './style';

function WorkspaceDetails({ workspace }) {
  const job = condenseJobs(workspace.jobs);

  return (
    <Flex>
      <JobLink workspace={workspace} job={job}>
        {workspace.name}
      </JobLink>
      <Typography variant="subtitle1">
        {' | '}
        <JobStatus job={job} />
      </Typography>
    </Flex>
  );
}

export default WorkspaceDetails;
