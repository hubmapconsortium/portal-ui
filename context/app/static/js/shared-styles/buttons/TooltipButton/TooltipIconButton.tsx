import React, { ElementType } from 'react';
import { IconButtonProps, IconButtonTypeMap } from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';

import TooltipButtonBase from './TooltipButtonBase';

export type TooltipButtonProps<E extends ElementType = IconButtonTypeMap['defaultComponent']> = {
  tooltip: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
} & IconButtonProps<E>;

function TooltipIconButton<E extends ElementType = IconButtonTypeMap['defaultComponent']>(
  { children, ...props }: TooltipButtonProps<E>,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  return (
    <TooltipButtonBase {...props} ref={ref} isIconButton>
      {children}
    </TooltipButtonBase>
  );
}

// @ts-expect-error Forwarded refs break button/link polymorphism, so we need to cast the forwarded ref to the correct type
const ForwardedTooltipIconButton = React.forwardRef(TooltipIconButton) as typeof TooltipIconButton;

const RectangularTooltipIconButton = styled(ForwardedTooltipIconButton)(() => ({
  borderRadius: '0px',
}));

const WhiteRectangularTooltipIconButton = styled(RectangularTooltipIconButton)(({ theme }) => ({
  backgroundColor: theme.palette.white.main,
  color: theme.palette.primary.main,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(0.5),
  height: theme.spacing(4.5),
  display: 'flex',
}));

export { RectangularTooltipIconButton, WhiteRectangularTooltipIconButton };
export default ForwardedTooltipIconButton;
