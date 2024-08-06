import React, { PropsWithChildren, ComponentProps } from 'react';
import { styled } from '@mui/material/styles';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ToggleButton from '@mui/material/ToggleButton';
import Button from '@mui/material/Button';
import { SecondaryBackgroundTooltip } from '../tooltips';
import BlankDropdownMenuButton from '../dropdowns/BlankDropdownMenuButton';

const iconButtonHeight = 40;

const whiteBackgroundCSS = {
  backgroundColor: '#fff',
  height: `${iconButtonHeight}px`,
  width: `${iconButtonHeight}px`,
  border: `1px solid gray`,
  borderRadius: '4px',
  padding: '0px',
};

const svgStyles = {
  fontSize: '1.25rem',
};

const WhiteBackgroundIconButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  ...whiteBackgroundCSS,
  '& svg': svgStyles,
  border: `1px solid ${theme.palette.divider}`,
}));

const WhiteBackgroundBlankDropdownMenuButton = styled(BlankDropdownMenuButton)(({ theme }) => ({
  ...whiteBackgroundCSS,
  '& svg': svgStyles,
  border: `1px solid ${theme.palette.divider}`,
}));

const WhiteBackgroundToggleButton = styled(ToggleButton)({
  ...whiteBackgroundCSS,
  border: 0,
  '& svg': svgStyles,
});

interface TooltipToggleButtonProps extends PropsWithChildren, ComponentProps<typeof WhiteBackgroundToggleButton> {
  tooltipComponent?: React.ElementType;
  tooltipTitle: string;
  id: string;
}

function TooltipToggleButton({
  children,
  tooltipComponent = SecondaryBackgroundTooltip,
  tooltipTitle,
  id,
  ...rest
}: TooltipToggleButtonProps) {
  const Tooltip = tooltipComponent;

  return (
    <Tooltip title={tooltipTitle}>
      <WhiteBackgroundToggleButton {...rest} id={id} data-testid={id}>
        {children}
      </WhiteBackgroundToggleButton>
    </Tooltip>
  );
}

const WhiteTextButton = styled(Button)({
  color: '#fff',
});

export default TooltipToggleButton;

export {
  WhiteBackgroundIconButton,
  WhiteBackgroundBlankDropdownMenuButton,
  TooltipToggleButton,
  iconButtonHeight,
  WhiteTextButton,
};
