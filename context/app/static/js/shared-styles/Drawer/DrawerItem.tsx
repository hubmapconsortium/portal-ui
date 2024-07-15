import React from 'react';
import { DrawerListItem, DrawerListItemIcon, StyledListItemText } from './styles';
import { InternalLink, OutboundLink } from '../Links';
import { DrawerItemProps } from './types';
import { ExternalLinkIcon } from '../icons';

function formatPrimaryText(label: string, href: string): [React.ReactNode, typeof InternalLink | typeof OutboundLink] {
  const isInternal = href.startsWith('/');
  const LinkComponent = isInternal ? InternalLink : OutboundLink;
  const primaryText = isInternal ? (
    label
  ) : (
    <>
      {label} <ExternalLinkIcon color="info" fontSize="1rem" />
    </>
  );
  return [primaryText, LinkComponent];
}

export default function DrawerItem({ href, label, description, icon }: DrawerItemProps) {
  const [primaryText, LinkComponent] = formatPrimaryText(label, href);
  return (
    <LinkComponent href={href}>
      <DrawerListItem disablePadding>
        <DrawerListItemIcon>{icon}</DrawerListItemIcon>
        <StyledListItemText primary={primaryText} secondary={description} />
      </DrawerListItem>
    </LinkComponent>
  );
}
