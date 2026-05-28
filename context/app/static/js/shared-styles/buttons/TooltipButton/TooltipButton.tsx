import { ButtonProps } from '@mui/material/Button';
import React from 'react';
import TooltipButtonBase from './TooltipButtonBase';

interface TooltipButtonProps extends ButtonProps {
  tooltip: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}

function TooltipButton({ children, ref, ...props }: TooltipButtonProps) {
  return (
    <TooltipButtonBase {...props} ref={ref} isIconButton={false}>
      {children}
    </TooltipButtonBase>
  );
}

export default TooltipButton;
