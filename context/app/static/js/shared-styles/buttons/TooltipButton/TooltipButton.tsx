import Button, { ButtonProps } from '@mui/material/Button';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import React from 'react';

interface TooltipButtonProps extends ButtonProps {
  tooltip: React.ReactNode;
}

function TooltipButton(
  { tooltip, children, component, ...props }: TooltipButtonProps,
  ref: React.Ref<HTMLButtonElement>,
) {
  return (
    <SecondaryBackgroundTooltip describeChild title={tooltip}>
      <Button {...props} ref={ref}>
        {children}
      </Button>
    </SecondaryBackgroundTooltip>
  );
}

export default React.forwardRef(TooltipButton);
