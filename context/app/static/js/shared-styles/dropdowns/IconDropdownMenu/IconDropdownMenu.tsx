import React, { PropsWithChildren } from 'react';

import SvgIcon from '@mui/icons-material/GetAppRounded';
import MenuList from '@mui/material/MenuList';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';

import { WhiteBackgroundIconDropdownMenuButton } from 'js/shared-styles/buttons';
import withDropdownMenuProvider from 'js/shared-styles/dropdowns/DropdownMenuProvider/withDropdownMenuProvider';
import DropdownMenu from 'js/shared-styles/dropdowns/DropdownMenu';

import { StyledSecondaryBackgroundTooltip, StyledSvgIcon, StyledTypography } from './style';

interface IconDropdownMenuItemProps {
  children: string;
  icon: typeof SvgIcon;
  onClick: () => void;
  disabled?: boolean;
}

export function IconDropdownMenuItem({ icon, onClick, disabled, children }: IconDropdownMenuItemProps) {
  return (
    <MenuItem onClick={onClick} disabled={disabled}>
      <ListItemIcon>
        <StyledSvgIcon component={icon} color="primary" />
      </ListItemIcon>
      <StyledTypography variant="inherit">{children}</StyledTypography>
    </MenuItem>
  );
}

interface IconDropdownMenuProps {
  tooltip: string;
  icon: typeof SvgIcon;
}

function IconDropdownMenu({ tooltip, icon, children }: PropsWithChildren<IconDropdownMenuProps>) {
  return (
    <>
      <StyledSecondaryBackgroundTooltip title={tooltip}>
        <WhiteBackgroundIconDropdownMenuButton menuID={tooltip}>
          <SvgIcon component={icon} />
        </WhiteBackgroundIconDropdownMenuButton>
      </StyledSecondaryBackgroundTooltip>
      <DropdownMenu id={`${tooltip}-menu`}>
        <MenuList id="menu-options">{children}</MenuList>
      </DropdownMenu>
    </>
  );
}

export default withDropdownMenuProvider(IconDropdownMenu, false);
