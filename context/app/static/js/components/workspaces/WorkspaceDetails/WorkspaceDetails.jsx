import React from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import JobStatus from 'js/components/workspaces/JobStatus';
import { condenseJobs, getWorkspaceLink } from 'js/components/workspaces/utils';
import OutboundLink from 'js/shared-styles/Links/OutboundLink';

const typographyVariant = 'subtitle1';

function WorkspaceDetails({ workspace, handleStartWorkspace }) {
  const job = condenseJobs(workspace.jobs);
  const link = getWorkspaceLink(workspace);

  return (
    <Stack direction="column">
      <OutboundLink href={link} variant={typographyVariant} onClick={() => handleStartWorkspace(workspace.id)}>
        {workspace.name}
      </OutboundLink>
      <Typography variant="body2">
        <JobStatus job={job} />
        &nbsp;|&nbsp; Created {workspace.datetime_created.slice(0, 10)}
      </Typography>
    </Stack>
  );
}

export default WorkspaceDetails;
