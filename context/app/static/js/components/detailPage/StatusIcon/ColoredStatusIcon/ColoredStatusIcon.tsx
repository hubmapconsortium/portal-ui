import React from 'react';
import { ColoredStatusIconProps, iconSymbolStatusMap } from 'js/shared-styles/icons/SeverityIcon';
import { getStyledIcon } from './style';

function ColoredStatusIcon({ $iconStatus, ...props }: ColoredStatusIconProps) {
  const IconComponent = iconSymbolStatusMap[$iconStatus];
  const StyledIcon = getStyledIcon(IconComponent, $iconStatus);
  return <StyledIcon {...props} />;
}

export { ColoredStatusIcon };
