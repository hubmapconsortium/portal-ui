import React from 'react';

import { DatabaseIcon, InfoIcon } from 'js/shared-styles/icons';
import AppsRounded from '@mui/icons-material/AppsRounded';
import MenuRounded from '@mui/icons-material/MenuRounded';
import PersonRounded from '@mui/icons-material/PersonRounded';
import HeaderNavigationDrawer from './HeaderNavigationDrawer';
import { dataLinks, resourceLinks, toolsAndAppsLinks, userLinks, mobileMenuLinks } from '../staticLinks';

export function DataLinks() {
  return <HeaderNavigationDrawer title="Data" sections={dataLinks} icon={<DatabaseIcon />} direction="left" />;
}

export function ResourcesLinks() {
  return <HeaderNavigationDrawer title="Resources" sections={resourceLinks} icon={<InfoIcon />} direction="left" />;
}

export function ToolsAndApplicationLinks() {
  return (
    <HeaderNavigationDrawer
      title="Resources"
      sections={toolsAndAppsLinks}
      icon={<AppsRounded />}
      direction="right"
      altOnlyTitle
    />
  );
}

export function UserLinks() {
  return (
    <HeaderNavigationDrawer
      title="Your Profile"
      sections={userLinks}
      icon={<PersonRounded />}
      direction="right"
      altOnlyTitle
    />
  );
}

export function MobileMenu() {
  return (
    <HeaderNavigationDrawer
      title="Data"
      sections={mobileMenuLinks}
      icon={<MenuRounded />}
      direction="left"
      altOnlyTitle
    />
  );
}
