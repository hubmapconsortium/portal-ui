import React, { PropsWithChildren } from 'react';
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem';

interface DropdownLinkProps extends MenuItemProps {
  href: string;
  isIndented: boolean;
}

function DropdownLink({ href, isIndented, children, ...rest }: PropsWithChildren<DropdownLinkProps>) {
  return (
    <MenuItem
      sx={({ spacing, palette }) => ({
        color: palette.primary.main,
        paddingLeft: isIndented ? spacing(5) : spacing(2),
      })}
      component="a"
      href={href}
      {...rest}
    >
      {children}
    </MenuItem>
  );
}
export default DropdownLink;
