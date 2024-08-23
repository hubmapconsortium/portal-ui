import React from 'react';
import SeverityIcon, { IconStatus } from 'js/shared-styles/icons/SeverityIcon';
import { SvgIconProps } from '@mui/material/SvgIcon';

function ColoredStatusIcon({
  status,
  noColor,
  ...props
}: Partial<SvgIconProps> & { status: IconStatus; noColor?: boolean }) {
  return (
    <SeverityIcon
      status={status}
      sx={{ fontSize: 16, marginRight: '3px', alignSelf: 'center', color: noColor ? 'white' : undefined }}
      {...props}
    />
  );
}

export { ColoredStatusIcon };
