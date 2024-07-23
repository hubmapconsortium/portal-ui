import React from 'react';
import { Tooltip } from '@mui/material';
import { ColoredStatusIconProps, getStyledIcon, iconSymbolStatusMap } from './style';

function ColoredStatusIcon({ $iconStatus, status, ...props }: ColoredStatusIconProps) {
  const IconComponent = iconSymbolStatusMap[$iconStatus];
  const StyledIcon = getStyledIcon(IconComponent, $iconStatus);
  return (
    <Tooltip title={status}>
      <StyledIcon {...props} />
    </Tooltip>
  );
}

export { ColoredStatusIcon };
