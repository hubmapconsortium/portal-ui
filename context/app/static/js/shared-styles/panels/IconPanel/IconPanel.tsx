import React, { PropsWithChildren } from 'react';

import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import SeverityIcon, { ColoredStatusIconProps } from 'js/shared-styles/icons/SeverityIcon';

interface IconPanelProps extends PropsWithChildren {
  $iconStatus: ColoredStatusIconProps['$iconStatus'];
}

function IconPanel({ $iconStatus, children }: IconPanelProps) {
  return (
    <Stack component={Paper} direction="row" p={2} spacing={1} marginBottom={1}>
      <SeverityIcon status={$iconStatus} color="primary" />
      <Typography>{children}</Typography>
    </Stack>
  );
}

export default IconPanel;
