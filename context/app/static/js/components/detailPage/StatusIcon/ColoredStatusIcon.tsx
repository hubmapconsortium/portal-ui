import React from 'react';
import { ColoredStatusIconProps, getStyledIcon, iconSymbolStatusMap } from './style';

function ColoredStatusIcon({ $iconStatus, ...props }: ColoredStatusIconProps) {
  const IconComponent = iconSymbolStatusMap[$iconStatus];
  const StyledIcon = getStyledIcon(IconComponent, $iconStatus);
  return <StyledIcon {...props} />;
}

export { ColoredStatusIcon };
