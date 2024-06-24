import React from 'react';
import { DrawerListItem, DrawerListItemIcon, StyledListItemText } from './styles';
import { InternalLink, OutboundLink } from '../Links';
import { DrawerItemProps } from './types';

export default function DrawerItem({ href, label, description, icon }: DrawerItemProps) {
  const isInternal = href.startsWith('/');
  const LinkComponent = isInternal ? InternalLink : OutboundLink;
  return (
    <LinkComponent href={href}>
      <DrawerListItem disablePadding>
        <DrawerListItemIcon>{icon}</DrawerListItemIcon>
        <StyledListItemText primary={label} secondary={description} />
      </DrawerListItem>
    </LinkComponent>
  );
}
