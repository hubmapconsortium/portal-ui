import React from 'react';
import { DrawerList, StyledListSubheader } from './styles';
import { DrawerSectionProps } from './types';
import DrawerItem from './DrawerItem';

export default function DrawerSection({ title, items, hideTitle = false }: DrawerSectionProps) {
  return (
    <DrawerList disablePadding>
      {!hideTitle && <StyledListSubheader>{title}</StyledListSubheader>}
      {items.map((props) => (
        <DrawerItem key={props.label} {...props} />
      ))}
    </DrawerList>
  );
}
