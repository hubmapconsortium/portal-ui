import React from 'react';
import AppsRounded from '@mui/icons-material/AppsRounded';
import MenuRounded from '@mui/icons-material/MenuRounded';

import { useAppContext } from 'js/components/Contexts';
import { useInvitationsList } from 'js/components/workspaces/hooks';
import { DatabaseIcon, InfoIcon } from 'js/shared-styles/icons';
import UserIcon from '../UserIcon';
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
      title="Tools and Applications"
      sections={toolsAndAppsLinks}
      icon={<AppsRounded />}
      direction="right"
      altOnlyTitle
      tooltipText="HuBMAP Tools & Applications"
    />
  );
}

export function UserLinks() {
  const { isAuthenticated, isHubmapUser, userEmail } = useAppContext();
  const { numPendingReceivedInvitations } = useInvitationsList();

  return (
    <HeaderNavigationDrawer
      title="Your Profile"
      sections={userLinks({ isAuthenticated, isHubmapUser, userEmail, numPendingReceivedInvitations })}
      icon={<UserIcon />}
      direction="right"
      altOnlyTitle
      tooltipText={isAuthenticated ? userEmail : 'Your Profile'}
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
