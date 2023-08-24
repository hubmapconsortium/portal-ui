import React from 'react';
import Tooltip, { TooltipProps } from '@mui/material/Tooltip';

function SecondaryBackgroundTooltip({ children, ...rest }: TooltipProps) {
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
