import { ButtonProps } from '@mui/material/Button';
import React from 'react';
import TooltipButtonBase from './TooltipButtonBase';

interface TooltipButtonProps extends ButtonProps {
  tooltip: React.ReactNode;
}

function TooltipButton({ children, ...props }: TooltipButtonProps, ref: React.Ref<HTMLButtonElement>) {
  return (
    <TooltipButtonBase {...props} ref={ref} isIconButton={false}>
      {children}
    </TooltipButtonBase>
  );
}

export default React.forwardRef(TooltipButton);
