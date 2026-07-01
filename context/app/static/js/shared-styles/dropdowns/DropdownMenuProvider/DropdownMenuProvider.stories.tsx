import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import MenuItem from '@mui/material/MenuItem';

import DropdownMenuButton from 'js/shared-styles/dropdowns/DropdownMenuButton';
import DropdownMenu from 'js/shared-styles/dropdowns/DropdownMenu';
import DropdownMenuProviderComponent, { useDropdownMenuStore } from './DropdownMenuProvider';

const meta = {
  title: 'dropdowns/DropdownMenuProvider',
  component: DropdownMenuProviderComponent,
  subcomponents: { DropdownMenu, DropdownMenuButton },
  excludeStories: ['menuID', 'menuItemText', 'menuButtonText'],
} satisfies Meta<typeof DropdownMenuProviderComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const menuID = 'example-dropdown';
export const menuItemText = 'Menu Item';
export const menuButtonText = 'Click to open';

function ExampleMenuItem() {
  const { closeMenu } = useDropdownMenuStore();
  return <MenuItem onClick={closeMenu}>{menuItemText}</MenuItem>;
}

export const DropdownMenuProvider: Story = {
  args: {
    isOpenToStart: false,
  },
  render: (args) => (
    <DropdownMenuProviderComponent {...args}>
      <DropdownMenuButton menuID={menuID}>{menuButtonText}</DropdownMenuButton>
      <DropdownMenu id={menuID}>
        <ExampleMenuItem />
      </DropdownMenu>
    </DropdownMenuProviderComponent>
  ),
};
