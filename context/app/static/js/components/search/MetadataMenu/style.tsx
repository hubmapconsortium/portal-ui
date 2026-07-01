import React from 'react';
import { styled } from '@mui/material/styles';
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem';

import { InfoIcon } from 'js/shared-styles/icons';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';

const StyledInfoIcon = styled(InfoIcon)(({ theme }) => ({
  fontSize: '1rem',
  marginLeft: theme.spacing(0.5),
}));

interface StyledMenuItemProps extends MenuItemProps {
  tooltip?: string;
  isLoading?: boolean;
  href?: string;
}

const StyledMenuItem = styled(({ tooltip, isLoading, children, href, disabled, ...props }: StyledMenuItemProps) => {
  const menuItem = (
    <MenuItem disabled={disabled} {...props} {...(href ? { href, component: 'a' } : {})}>
      <Stack direction="column" width="100%">
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <span>{children}</span>
          {tooltip && (
            <SecondaryBackgroundTooltip title={tooltip} placement="bottom-start">
              <StyledInfoIcon color="primary" />
            </SecondaryBackgroundTooltip>
          )}
        </Stack>
        {isLoading && <LinearProgress />}
      </Stack>
    </MenuItem>
  );

  // Wrap in a span when disabled so tooltip hover still works
  // (disabled elements have pointer-events: none which blocks tooltip triggers)
  if (disabled && tooltip) {
    return (
      <SecondaryBackgroundTooltip title={tooltip} placement="bottom-start">
        <span style={{ display: 'block', width: '100%' }}>{menuItem}</span>
      </SecondaryBackgroundTooltip>
    );
  }

  return menuItem;
})({
  width: '100%',
  color: 'black',
});

export { StyledInfoIcon, StyledMenuItem };
