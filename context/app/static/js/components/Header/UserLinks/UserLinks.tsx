import React from 'react';
import PersonRounded from '@mui/icons-material/PersonRounded';
import Button from '@mui/material/Button';

import NavigationDrawer, { useDrawerState, type DrawerSection } from 'js/shared-styles/Drawer';
import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import HeaderButton from '../HeaderButton/HeaderButton';

function AuthButton({ isAuthenticated }: { isAuthenticated: boolean }) {
  if (isAuthenticated) {
    return (
      <Button variant="contained" color="warning" href="/logout">
        Log Out
      </Button>
    );
  }
  return (
    <Button variant="contained" color="primary" href="/login">
      Log In
    </Button>
  );
}

const userLinkSections: DrawerSection[] = [
  {
    title: 'Your Profile',
    hideTitle: true,
    items: [
      {
        href: '/profile',
        label: 'Profile',
        description: 'Find information about your profile',
        icon: <PersonRounded />,
      },
      {
        href: '/my-lists',
        label: 'My Lists',
        description: 'Find your bookmarks and lists',
        icon: <entityIconMap.Collection />,
      },
      {
        href: '/my-workspaces',
        label: 'My Workspaces',
        description: 'Find your workspaces',
        icon: <entityIconMap.Workspace />, // TODO: Fix styles
      },
    ],
  },
  <AuthButton key="auth-button" isAuthenticated={isAuthenticated} />,
];

function UserLinks() {
  const { open, toggle, onClose } = useDrawerState();

  const title = 'Your Profile';

  return (
    <>
      <HeaderButton tooltip={title} title={title} altOnlyTitle onClick={toggle} icon={<PersonRounded />} />
      <NavigationDrawer title={title} direction="right" sections={userLinkSections} onClose={onClose} open={open} />
    </>
  );
}

export default UserLinks;
