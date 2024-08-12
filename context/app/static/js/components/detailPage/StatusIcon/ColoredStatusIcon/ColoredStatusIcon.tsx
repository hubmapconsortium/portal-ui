import React from 'react';
import { ColoredStatusIconProps, getStyledIcon } from './style';

function ColoredStatusIcon({ $iconStatus, ...props }: ColoredStatusIconProps) {
  const StyledIcon = getStyledIcon($iconStatus);
  return <StyledIcon {...props} />;
}

export { ColoredStatusIcon };
