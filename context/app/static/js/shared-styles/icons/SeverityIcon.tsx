import React from 'react';
import { InfoRounded, ErrorRounded, WarningRounded, CheckCircleRounded } from '@mui/icons-material';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

export type IconStatus = 'info' | 'success' | 'warning' | 'error';

export const iconSymbolStatusMap: Record<IconStatus, React.ComponentType<SvgIconProps>> = {
  info: InfoRounded,
  success: CheckCircleRounded,
  warning: WarningRounded,
  error: ErrorRounded,
};

function SeverityIcon({
  status,
  noColor,
  ...svgIconProps
}: Partial<SvgIconProps> & { status: IconStatus; noColor?: boolean }) {
  return <SvgIcon color={noColor ? 'white' : status} component={iconSymbolStatusMap[status]} {...svgIconProps} />;
}

export default SeverityIcon;
