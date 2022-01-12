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
};

function ExampleMenuItem() {
  const { closeMenu } = useStore();
  return <MenuItem onClick={closeMenu}>Menu Item</MenuItem>;
}

const menuID = 'example-dropdown';

export const DropdownMenuProvider = (args) => (
  <DropdownMenuProviderComponent {...args}>
    <DropdownMenuButton menuID={menuID}>Click to open</DropdownMenuButton>
    <DropdownMenu id={menuID}>
      <ExampleMenuItem />
    </DropdownMenu>
  </DropdownMenuProviderComponent>
);
DropdownMenuProvider.args = {
  isOpenToStart: false,
};

DropdownMenuProvider.storyName = 'DropdownMenuProvider';
