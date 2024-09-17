import React, { PropsWithChildren } from 'react';

import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { InfoIcon } from 'js/shared-styles/icons';
import { LoginButton } from 'js/components/detailPage/BulkDataTransfer/style';
import { trackEvent } from 'js/helpers/trackers';
import { WorkspacesEventInfo } from 'js/components/workspaces/types';

interface LogInPanelProps extends PropsWithChildren {
  trackingInfo: WorkspacesEventInfo;
}

function LogInPanel({ children, trackingInfo }: LogInPanelProps) {
  if (isAuthenticated) {
    return null;
  }

  return (
    <Stack component={Paper} p={2} spacing={2}>
      <Stack direction="row" spacing={2}>
        <InfoIcon color="primary" fontSize="1.5rem" />
        <Typography>{children}</Typography>
      </Stack>
      <Box>
        <LoginButton
          href="/login"
          variant="contained"
          color="primary"
          onClick={() =>
            trackEvent({
              ...trackingInfo,
              action: 'Log In / From panel',
              label: 'info panel',
            })
          }
        >
          Log In
        </LoginButton>
      </Box>
    </Stack>
  );
}

export default LogInPanel;
