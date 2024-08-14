import React, { PropsWithChildren } from 'react';

import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import {
  ColoredStatusIconProps,
  iconSymbolStatusMap,
} from 'js/components/detailPage/StatusIcon/ColoredStatusIcon/style';
import { getStyledIcon } from './style';

interface IconPanelProps extends PropsWithChildren {
  $iconStatus: ColoredStatusIconProps['$iconStatus'];
}

function IconPanel({ $iconStatus, children }: IconPanelProps) {
  const IconComponent = iconSymbolStatusMap[$iconStatus];
  const StyledIcon = getStyledIcon(IconComponent);

  return (
    <Stack component={Paper} direction="row" p={2} spacing={1} marginBottom={1}>
      <StyledIcon />
      <Typography>{children}</Typography>
    </Stack>
  );
}

export default IconPanel;
