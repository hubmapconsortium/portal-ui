import React from 'react';
import { DrawerList, StyledListSubheader } from './styles';
import { DrawerSectionProps } from './types';
import DrawerItem from './DrawerItem';
import { itemIsProps } from './utils';

export default function DrawerSection({ title, items, hideTitle = false, titleProps }: DrawerSectionProps) {
  return (
    <DrawerList disablePadding>
      {!hideTitle && <StyledListSubheader {...titleProps}>{title}</StyledListSubheader>}
      {items.map((item) => {
        if (itemIsProps(item)) {
          return <DrawerItem key={item.label} {...item} />;
        }
        return item;
      })}
    </DrawerList>
  );
}
