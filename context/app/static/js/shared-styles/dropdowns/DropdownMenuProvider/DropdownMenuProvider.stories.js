import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';

import DropdownMenuButton from 'js/shared-styles/dropdowns/DropdownMenuButton';
import DropdownMenu from 'js/shared-styles/dropdowns/DropdownMenu';
import DropdownMenuProviderComponent from './DropdownMenuProvider';
import { useStore } from './store';

export default {
  title: 'dropdowns/DropdownMenuProvider',
  component: DropdownMenuProviderComponent,
  subcomponents: [DropdownMenu, DropdownMenuButton],
  excludeStories: ['menuID', 'menuItemText', 'menuButtonText'],
};

export const menuID = 'example-dropdown';
export const menuItemText = 'Menu Item';
export const menuButtonText = 'Click to open';

function ExampleMenuItem() {
  const { closeMenu } = useStore();
  return <MenuItem onClick={closeMenu}>{menuItemText}</MenuItem>;
}

export function DropdownMenuProvider(args) {
  return (
    <DropdownMenuProviderComponent {...args}>
      <DropdownMenuButton menuID={menuID}>{menuButtonText}</DropdownMenuButton>
      <DropdownMenu id={menuID}>
        <ExampleMenuItem />
      </DropdownMenu>
    </DropdownMenuProviderComponent>
  );
}
DropdownMenuProvider.args = {
  isOpenToStart: false,
};

DropdownMenuProvider.storyName = 'DropdownMenuProvider';
