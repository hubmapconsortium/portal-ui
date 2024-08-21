import React, { PropsWithChildren } from 'react';

import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import SeverityIcon, { IconStatus } from 'js/shared-styles/icons/SeverityIcon';

interface IconPanelProps extends PropsWithChildren {
  status: IconStatus;
}

function IconPanel({ status, children }: IconPanelProps) {
  return (
    <Stack component={Paper} direction="row" p={2} spacing={1} marginBottom={1}>
      <SeverityIcon status={status} color="primary" sx={{ fontSize: '1.5rem' }} />
      <Typography>{children}</Typography>
    </Stack>
  );
}

export default IconPanel;
