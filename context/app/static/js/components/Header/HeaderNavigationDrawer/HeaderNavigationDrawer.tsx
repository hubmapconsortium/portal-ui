import React from 'react';
import { useEventCallback } from '@mui/material/utils';
import NavigationDrawer, { DrawerSection, useDrawerState } from 'js/shared-styles/Drawer';
import { CloseIcon } from 'js/shared-styles/icons';
import { trackEvent } from 'js/helpers/trackers';
import HeaderButton from '../HeaderButton/HeaderButton';

interface HeaderNavigationDrawerProps {
  title: string;
  icon: React.ReactNode;
  sections: DrawerSection[];
  direction: 'left' | 'right';
  altOnlyTitle?: boolean;
  tooltipText?: string;
  disableTextTransform?: boolean;
}

export default function HeaderNavigationDrawer({
  title,
  icon,
  sections,
  direction,
  altOnlyTitle,
  tooltipText,
  disableTextTransform,
}: HeaderNavigationDrawerProps) {
  const { open, toggle, onClose } = useDrawerState();

  const handleClick = useEventCallback(() => {
    trackEvent({
      category: 'Header Navigation',
      action: 'Open Drawer',
      label: title,
    });
    toggle();
  });

  return (
    <>
      <HeaderButton
        data-testid={`${encodeURI(title)}-dropdown`}
        title={title}
        altOnlyTitle={altOnlyTitle}
        onClick={handleClick}
        icon={open ? <CloseIcon fontSize="1.5rem" /> : icon}
        tooltip={tooltipText}
        disableTextTransform={disableTextTransform}
      />
      <NavigationDrawer title={title} direction={direction} sections={sections} onClose={onClose} open={open} />
    </>
  );
}
