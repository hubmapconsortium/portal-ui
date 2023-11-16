import React from 'react';
import { styled } from '@mui/material/styles';
import Link from '@mui/material/Link';
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem';

import { InfoIcon } from 'js/shared-styles/icons';
import DropdownMenuButton from 'js/shared-styles/dropdowns/DropdownMenuButton';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';

const StyledDropdownMenuButton = styled(DropdownMenuButton)(({ theme }) => ({
  margin: theme.spacing(0, 1),
}));

const StyledInfoIcon = styled(InfoIcon)(({ theme }) => ({
  fontSize: '1rem',
  marginLeft: theme.spacing(0.5),
}));

interface StyledMenuItemProps extends MenuItemProps {
  tooltip?: string;
  isLoading?: boolean;
  href?: string;
}

const StyledMenuItem = styled(({ tooltip, isLoading, children, href, ...props }: StyledMenuItemProps) => {
  const item = (
    <MenuItem {...props}>
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
  if (href) {
    return (
      <Link underline="none" href={href}>
        {item}
      </Link>
    );
  }
  return item;
})({
  width: '100%',
  color: 'black',
});

export { StyledDropdownMenuButton, StyledInfoIcon, StyledMenuItem };
