import React from 'react';

import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { InfoIcon } from 'js/shared-styles/icons';

function InfoAlert({ children }: { children: React.ReactNode }) {
  return (
    <Stack component={Paper} p={2} spacing={2} marginBottom={1.25}>
      <Stack direction="row" spacing={2}>
        <InfoIcon color="primary" fontSize="1.5rem" />
        <Typography>{children}</Typography>
      </Stack>
    </Stack>
  );
}

export default InfoAlert;
