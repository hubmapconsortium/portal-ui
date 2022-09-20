import React from 'react';
import Typography from '@material-ui/core/Typography';

import { condenseJobs } from 'js/components/workspaces/utils';
import JobStatus from 'js/components/workspaces/JobStatus';

import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import { Flex } from './style';

const typographyVariant = 'subtitle1';

function WorkspaceDetails({ workspace }) {
  const job = condenseJobs(workspace.jobs);

  return (
    <Flex>
      <OutboundIconLink href={`/workspaces/${workspace.id}#${workspace.path}`} variant={typographyVariant}>
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
