import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import JobStatus from 'js/components/workspaces/JobStatus';
import { condenseJobs } from 'js/components/workspaces/utils';
import { InternalLink } from 'js/shared-styles/Links';

const typographyVariant = 'subtitle1';

function WorkspaceDetails({ workspace, handleStartWorkspace }) {
  const job = condenseJobs(workspace.jobs);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <InternalLink
        href={`/workspaces/${workspace.id}?notebook_path=${encodeURIComponent(workspace.path)}`}
        variant={typographyVariant}
        onClick={() => handleStartWorkspace(workspace.id)}
      >
        {workspace.name}
      </InternalLink>
      <Typography variant="body2">
        <JobStatus job={job} />
        &nbsp;|&nbsp; Created {workspace.datetime_created.slice(0, 10)}
      </Typography>
    </Box>
  );
}

export default WorkspaceDetails;
