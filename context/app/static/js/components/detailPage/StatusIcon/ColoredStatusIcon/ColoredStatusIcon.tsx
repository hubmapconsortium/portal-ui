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
      noColor={noColor}
      sx={({ spacing }) => ({ fontSize: '1rem', marginRight: spacing(1), alignSelf: 'center' })}
      {...props}
    />
  );
}

export { ColoredStatusIcon };
