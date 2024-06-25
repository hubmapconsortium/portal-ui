import NavigationDrawer, { DrawerSection, useDrawerState } from 'js/shared-styles/Drawer';
import React from 'react';
import HeaderButton from '../HeaderButton/HeaderButton';

interface HeaderNavigationDrawerProps {
  title: string;
  icon: React.ReactNode;
  sections: DrawerSection[];
  direction: 'left' | 'right';
  altOnlyTitle?: boolean;
}

export default function HeaderNavigationDrawer({
  title,
  icon,
  sections,
  direction,
  altOnlyTitle,
}: HeaderNavigationDrawerProps) {
  const { open, toggle, onClose } = useDrawerState();
  return (
    <>
      <HeaderButton title={title} altOnlyTitle={altOnlyTitle} onClick={toggle} icon={icon} />
      <NavigationDrawer title={title} direction={direction} sections={sections} onClose={onClose} open={open} />
    </>
  );
}
