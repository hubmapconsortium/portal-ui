import React, { PropsWithChildren } from 'react';

import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { InfoIcon } from 'js/shared-styles/icons';
import { LoginButton } from 'js/components/detailPage/BulkDataTransfer/style';

interface LogInPanelProps extends PropsWithChildren {
  onClick?: () => void;
}

function LogInPanel({ children, onClick }: LogInPanelProps) {
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
        <LoginButton href="/login" variant="contained" color="primary" onClick={onClick}>
          Log In
        </LoginButton>
      </Box>
    </Stack>
  );
}

export default LogInPanel;
