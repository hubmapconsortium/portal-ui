import React from 'react';

import { useIsMobile } from 'js/hooks/media-queries';

import { Spacer } from './style';
import HubmapLogo from '../HubmapLogo';
import {
  ToolsAndApplicationLinks,
  UserLinks,
  DataLinks,
  ResourcesLinks,
  MobileMenu,
} from '../HeaderNavigationDrawer/instances';

function HubmapLogoLink() {
  return (
    <a href="/">
      <HubmapLogo aria-label="HubMAP logo" />
    </a>
  );
}

function MobileHeader() {
  return (
    <>
      <MobileMenu />
      <HubmapLogoLink />
      <ToolsAndApplicationLinks />
      <Spacer />
      <UserLinks />
    </>
  );
}

function DesktopHeader() {
  return (
    <>
      <HubmapLogoLink />
      <DataLinks />
      <ResourcesLinks />
      <ToolsAndApplicationLinks />
      <Spacer />
      <UserLinks />
    </>
  );
}

function HeaderContent() {
  const isMobile = useIsMobile();
  if (isMobile) {
    return <MobileHeader />;
  }

  return <DesktopHeader />;
}

export default HeaderContent;
