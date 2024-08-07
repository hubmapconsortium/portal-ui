import React, { PropsWithChildren } from 'react';

import SvgIcon from '@mui/icons-material/GetAppRounded';
import MenuList from '@mui/material/MenuList';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';

import { WhiteBackgroundIconDropdownMenuButton } from 'js/shared-styles/buttons';
import withDropdownMenuProvider from 'js/shared-styles/dropdowns/DropdownMenuProvider/withDropdownMenuProvider';
import DropdownMenu from 'js/shared-styles/dropdowns/DropdownMenu';

import { StyledSecondaryBackgroundTooltip, StyledSvgIcon, StyledTypography } from './style';

interface IconDropdownMenuItemProps extends PropsWithChildren {
  icon: typeof SvgIcon;
  onClick: () => void;
  disabled?: boolean;
}

function IconDropdownMenuItem({ icon, onClick, disabled, children }: IconDropdownMenuItemProps) {
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
  options: IconDropdownMenuItemProps[];
}

function IconDropdownMenu({ tooltip, icon, options }: IconDropdownMenuProps) {
  return (
    <>
      <StyledSecondaryBackgroundTooltip title={tooltip}>
        <WhiteBackgroundIconDropdownMenuButton menuID={tooltip}>
          <SvgIcon component={icon} />
        </WhiteBackgroundIconDropdownMenuButton>
      </StyledSecondaryBackgroundTooltip>
      <DropdownMenu id={`${tooltip}-menu`}>
        <MenuList id="menu-options">
          {options.map((props) => (
            <IconDropdownMenuItem key={props.icon.toString()} {...props} />
          ))}
        </MenuList>
      </DropdownMenu>
    </>
  );
}

export type { IconDropdownMenuItemProps };
export default withDropdownMenuProvider(IconDropdownMenu, false);
