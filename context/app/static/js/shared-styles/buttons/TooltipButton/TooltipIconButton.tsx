import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import React from 'react';

export interface TooltipButtonProps extends IconButtonProps {
  tooltip: React.ReactNode;
}

function TooltipIconButton(
  { tooltip, children, component, ...props }: TooltipButtonProps,
  ref: React.Ref<HTMLButtonElement>,
) {
  return (
    <SecondaryBackgroundTooltip describeChild title={tooltip}>
      <IconButton {...props} ref={ref}>
        {children}
      </IconButton>
    </SecondaryBackgroundTooltip>
  );
}

export default React.forwardRef(TooltipIconButton);
