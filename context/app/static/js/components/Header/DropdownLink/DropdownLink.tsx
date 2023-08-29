import React, { PropsWithChildren } from 'react';
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem';
import Link from '@mui/material/Link';

type DropdownLinkProps = {
  href: string;
  isIndented: boolean;
  rest?: MenuItemProps;
};

function DropdownLink({ href, isIndented, children, ...rest }: PropsWithChildren<DropdownLinkProps>) {
  return (
    <MenuItem
      $isIndented={isIndented}
      {...rest}
      sx={({ spacing, palette }) => ({
        color: palette.primary.main,
        paddingLeft: isIndented ? spacing(5) : spacing(2),
      })}
    >
      <Link href={href}>{children}</Link>
    </MenuItem>
  );
}
export default DropdownLink;
