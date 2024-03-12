import React, { PropsWithChildren } from 'react';
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem';
import { useTrackOutboundLink } from 'js/hooks/useTrackOutboundLink';
import { useExternalUrlProps } from 'js/hooks/useIsExternalUrl';

interface DropdownLinkProps extends MenuItemProps {
  href: string;
  isIndented: boolean;
}

function DropdownLink({ href, isIndented, children, onClick, ...rest }: PropsWithChildren<DropdownLinkProps>) {
  const handleClick = useTrackOutboundLink(onClick);
  const outboundProps = useExternalUrlProps(href);
  return (
    <MenuItem
      sx={({ spacing, palette }) => ({
        color: palette.primary.main,
        paddingLeft: isIndented ? spacing(5) : spacing(2),
      })}
      component="a"
      href={href}
      onClick={handleClick}
      {...outboundProps}
      {...rest}
    >
      {children}
    </MenuItem>
  );
}
export default DropdownLink;
