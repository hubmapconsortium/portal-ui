import React from 'react';
import { DrawerList, StyledListSubheader } from './styles';
import { DrawerSectionProps } from './types';
import DrawerItem from './DrawerItem';
import { itemIsProps } from './utils';

export default function DrawerSection({
  sectionTitle,
  drawerTitle,
  items,
  hideTitle = false,
  titleProps,
}: DrawerSectionProps & { drawerTitle: string }) {
  return (
    <DrawerList disablePadding>
      {!hideTitle && (
        <StyledListSubheader disableSticky {...titleProps}>
          {sectionTitle}
        </StyledListSubheader>
      )}
      {items.map((item) => {
        if (itemIsProps(item)) {
          return <DrawerItem key={item.label} sectionTitle={sectionTitle} drawerTitle={drawerTitle} {...item} />;
        }
        return item;
      })}
    </DrawerList>
  );
}
