import React from 'react';
import Tooltip, { TooltipProps } from '@mui/material/Tooltip';

interface SecondaryBackgroundTooltipProps extends TooltipProps {
  disabled?: boolean;
}

function SecondaryBackgroundTooltip({ disabled, children, ...rest }: SecondaryBackgroundTooltipProps) {
  if (disabled) {
    return children;
  }
  return (
    <Tooltip
      PopperProps={{
        sx: (theme) => ({
          '& .MuiTooltip-tooltip': {
            borderRadius: theme.spacing(1),
            backgroundColor: theme.palette.secondary.main,
          },
        }),
      }}
      {...rest}
      arrow
    >
      {children}
    </Tooltip>
  );
}

export { SecondaryBackgroundTooltip };
