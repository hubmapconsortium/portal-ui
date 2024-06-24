import React from 'react';

import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { DrawerSection, NavigationDrawerProps } from './types';
import { DrawerTitle, StyledDrawer } from './styles';
import DrawerSectionComponent from './DrawerSection';
import { getKeyFromSection, sectionIsProps } from './utils';

export default function NavigationDrawer({ title, direction, sections, onClose, open }: NavigationDrawerProps) {
  const sectionsWithDividers = sections.reduce((acc, section) => {
    return [...acc, <Divider key={`divider-${getKeyFromSection(section)}`} />, section];
  }, [] as DrawerSection[]);
  return (
    <StyledDrawer open={open} anchor={direction} onClose={onClose}>
      <Stack gap={2} useFlexGap>
        <DrawerTitle>{title}</DrawerTitle>
        {sectionsWithDividers.map((section) => {
          if (sectionIsProps(section)) {
            return <DrawerSectionComponent key={getKeyFromSection(section)} {...section} />;
          }
          return section;
        })}
      </Stack>
    </StyledDrawer>
  );
}
