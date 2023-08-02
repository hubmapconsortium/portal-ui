import React from 'react';
import Typography from '@mui/material/Typography';

import JobStatus from 'js/components/workspaces/JobStatus';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import { condenseJobs } from 'js/components/workspaces/utils';
import { Flex } from './style';

const typographyVariant = 'subtitle1';

function WorkspaceDetails({ workspace, handleStartWorkspace }) {
  const job = condenseJobs(workspace.jobs);

  return (
    <Flex>
      <OutboundIconLink
        href={`/workspaces/${workspace.id}?notebook_path=${encodeURIComponent(workspace.path)}`}
        variant={typographyVariant}
        onClick={() => handleStartWorkspace(workspace.id)}
      >
        {workspace.name}
      </OutboundIconLink>
      <Typography variant={typographyVariant}>
        &nbsp;|&nbsp;
        <JobStatus job={job} />
      </Typography>
    </Flex>
  );
}

export default WorkspaceDetails;
