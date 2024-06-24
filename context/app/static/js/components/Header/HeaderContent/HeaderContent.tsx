import React from 'react';

import { useIsDesktop } from 'js/hooks/media-queries';

import Menu from '../Menu';
import UserLinks from '../UserLinks';
import { Spacer, FlexNoWrap } from './style';
import HubmapLogo from '../HubmapLogo';
import ToolsAndApplicationLinks from '../ToolsAndApplications';
import DataLinks from '../DataLinks';
import ResourcesLinks from '../ResourcesLinks';

interface HeaderContentProps {
  anchorRef: React.RefObject<HTMLDivElement>;
}

function HubmapLogoLink() {
  return (
    <a href="/">
      <HubmapLogo aria-label="HubMAP logo" />
    </a>
  );
}

function MobileHeader({ anchorRef }: HeaderContentProps) {
  return (
    <>
      <Menu anchorRef={anchorRef} />
      <HubmapLogoLink />
    </>
  );
}

function HeaderContent({ anchorRef }: HeaderContentProps) {
  const shouldDisplayMenu = !useIsDesktop();

  if (shouldDisplayMenu) {
    return <MobileHeader anchorRef={anchorRef} />;
  }

  return (
    <>
      <HubmapLogoLink />
      <DataLinks />
      <ResourcesLinks />
      <Spacer />
      <ToolsAndApplicationLinks />
      <UserLinks />
    </>
  );
}

export default HeaderContent;
