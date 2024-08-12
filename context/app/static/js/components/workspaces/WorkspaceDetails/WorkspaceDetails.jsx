import React from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import JobStatus from 'js/components/workspaces/JobStatus';
import { condenseJobs, getWorkspaceLink } from 'js/components/workspaces/utils';
import InternalLink from 'js/shared-styles/Links/InternalLink';

const typographyVariant = 'subtitle1';

function WorkspaceDetails({ workspace }) {
  const job = condenseJobs(workspace.jobs);

  return (
    <Stack direction="column">
      <InternalLink href={getWorkspaceLink(workspace)} variant={typographyVariant}>
        {workspace.name}
      </InternalLink>
      <Typography variant="body2">
        <JobStatus job={job} />
        &nbsp;|&nbsp; ID: {workspace.id}
        &nbsp;|&nbsp; Created {workspace.datetime_created.slice(0, 10)}
      </Typography>
    </Stack>
  );
}

export default WorkspaceDetails;
