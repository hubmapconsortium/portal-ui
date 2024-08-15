import React from 'react';
import SeverityIcon, { IconStatus } from 'js/shared-styles/icons/SeverityIcon';
import { SvgIconProps } from '@mui/material/SvgIcon';

function ColoredStatusIcon({ status, ...props }: Partial<SvgIconProps> & { status: IconStatus }) {
  return <SeverityIcon status={status} sx={{ fontSize: 16, marginRight: '3px', alignSelf: 'center' }} {...props} />;
}

export { ColoredStatusIcon };
