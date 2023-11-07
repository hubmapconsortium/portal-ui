import React from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import JobStatus from 'js/components/workspaces/JobStatus';
import { condenseJobs, getWorkspaceLink } from 'js/components/workspaces/utils';
import InternalLink from 'js/shared-styles/Links/InternalLink';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import { useLaunchWorkspace } from '../hooks';

const typographyVariant = 'subtitle1';

function WorkspaceDetails({ workspace }) {
  const job = condenseJobs(workspace.jobs);
  const { handleLaunchWorkspace } = useLaunchWorkspace(workspace);
  const { toastError } = useSnackbarActions();

  const clickHandler = React.useCallback(
    (e) => {
      e.preventDefault();
      try {
        handleLaunchWorkspace();
      } catch (err) {
        toastError('Error launching workspace');
        console.error(err);
      }
    },
    [handleLaunchWorkspace, toastError],
  );

  return (
    <Stack direction="column">
      <InternalLink href={getWorkspaceLink(workspace)} variant={typographyVariant} onClick={clickHandler}>
        {workspace.name}
      </InternalLink>
      <Typography variant="body2">
        <JobStatus job={job} />
        &nbsp;|&nbsp; Created {workspace.datetime_created.slice(0, 10)}
      </Typography>
    </Stack>
  );
}

export default WorkspaceDetails;
