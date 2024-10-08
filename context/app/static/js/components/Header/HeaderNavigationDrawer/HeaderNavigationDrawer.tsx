import NavigationDrawer, { DrawerSection, useDrawerState } from 'js/shared-styles/Drawer';
import React from 'react';
import { CloseIcon } from 'js/shared-styles/icons';
import HeaderButton from '../HeaderButton/HeaderButton';

interface HeaderNavigationDrawerProps {
  title: string;
  icon: React.ReactNode;
  sections: DrawerSection[];
  direction: 'left' | 'right';
  altOnlyTitle?: boolean;
  tooltipText?: string;
}

export default function HeaderNavigationDrawer({
  title,
  icon,
  sections,
  direction,
  altOnlyTitle,
  tooltipText,
}: HeaderNavigationDrawerProps) {
  const { open, toggle, onClose } = useDrawerState();
  return (
    <>
      <HeaderButton
        data-testid={`${encodeURI(title)}-dropdown`}
        title={title}
        altOnlyTitle={altOnlyTitle}
        onClick={toggle}
        icon={open ? <CloseIcon fontSize="1.5rem" /> : icon}
        tooltip={tooltipText}
      />
      <NavigationDrawer title={title} direction={direction} sections={sections} onClose={onClose} open={open} />
    </>
  );
}
