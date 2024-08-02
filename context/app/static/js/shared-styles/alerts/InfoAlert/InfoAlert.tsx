import React from 'react';

import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { InfoIcon } from 'js/shared-styles/icons';

interface InfoAlertProps {
  text: string;
}

function InfoAlert({ text }: InfoAlertProps) {
  return (
    <Stack component={Paper} p={2} spacing={2} marginBottom={1.25}>
      <Stack direction="row" spacing={2}>
        <InfoIcon color="primary" fontSize="1.5rem" />
        <Typography>{text}</Typography>
      </Stack>
    </Stack>
  );
}

export default InfoAlert;
