import React, { PropsWithChildren } from 'react';
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem';
import { useTrackOutboundLink } from 'js/hooks/useTrackOutboundLink';

interface DropdownLinkProps extends MenuItemProps {
  href: string;
  isIndented: boolean;
}

function DropdownLink({ href, isIndented, children, onClick, ...rest }: PropsWithChildren<DropdownLinkProps>) {
  const handleClick = useTrackOutboundLink(onClick);
  return (
    <MenuItem
      sx={({ spacing, palette }) => ({
        color: palette.primary.main,
        paddingLeft: isIndented ? spacing(5) : spacing(2),
      })}
      component="a"
      href={href}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </MenuItem>
  );
}
export default DropdownLink;
