import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function WorkspaceLaunchSuccessToast(id: number) {
  return (
    <Stack sx={{ maxWidth: '22rem' }}>
      <Typography>
        Workspace successfully launched in a new tab. If the tab didn&apos;t open, please check your pop-up blocker
        settings and relaunch your workspace.
      </Typography>
      <Stack direction="row" justifyContent="flex-end" marginTop={1}>
        <Button href={`/workspaces/${id}`} variant="text" color="inherit">
          View Workspace Detail Page
        </Button>
      </Stack>
    </Stack>
  );
}

export default WorkspaceLaunchSuccessToast;
