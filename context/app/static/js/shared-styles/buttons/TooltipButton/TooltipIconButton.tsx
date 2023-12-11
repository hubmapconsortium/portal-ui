import React from 'react';
import { IconButtonProps } from '@mui/material/IconButton';

import TooltipButtonBase from './TooltipButtonBase';

export interface TooltipButtonProps extends IconButtonProps {
  tooltip: React.ReactNode;
}

function TooltipIconButton({ children, ...props }: TooltipButtonProps, ref: React.Ref<HTMLButtonElement>) {
  return (
    <TooltipButtonBase {...props} ref={ref} isIconButton>
      {children}
    </TooltipButtonBase>
  );
}

export default React.forwardRef(TooltipIconButton);
