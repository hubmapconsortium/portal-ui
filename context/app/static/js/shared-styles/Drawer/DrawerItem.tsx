import React from 'react';
import { useEventCallback } from '@mui/material/utils';
import { trackEvent } from 'js/helpers/trackers';
import { useAppContext } from 'js/components/Contexts';
import { profileTitle } from 'js/components/Header/HeaderNavigationDrawer/instances';
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

export default function DrawerItem({
  href,
  label,
  description,
  sectionTitle,
  drawerTitle,
  icon,
  endIcon,
}: DrawerItemProps & { sectionTitle: string; drawerTitle: string }) {
  const [primaryText, LinkComponent] = formatPrimaryText(label, href);
  const { isAuthenticated } = useAppContext();

  const handleTrack = useEventCallback(() => {
    const action =
      drawerTitle === profileTitle
        ? `${sectionTitle} / ${isAuthenticated ? 'Logged In' : 'Not Logged In'}`
        : sectionTitle;

    const eventLabel = sectionTitle === 'Account' ? 'My Profile' : label;

    trackEvent({
      category: `Header Navigation / ${drawerTitle}`,
      action,
      label: eventLabel,
    });
  });

  return (
    <LinkComponent href={href} onClick={handleTrack}>
      <DrawerListItem disablePadding>
        <DrawerListItemIcon>{icon}</DrawerListItemIcon>
        <StyledListItemText primary={primaryText} secondary={description} />
        {endIcon}
      </DrawerListItem>
    </LinkComponent>
  );
}
