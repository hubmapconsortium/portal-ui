import React from 'react';
import { render, screen, fireEvent } from 'test-utils/functions';
import MenuItem from '@mui/material/MenuItem';

import DropdownMenuButton from 'js/shared-styles/dropdowns/DropdownMenuButton';
import DropdownMenu from 'js/shared-styles/dropdowns/DropdownMenu';
import DropdownMenuProviderComponent, { useDropdownMenuStore } from './DropdownMenuProvider';

const menuID = 'example-dropdown';
const menuItemText = 'Menu Item';
const menuButtonText = 'Click to open';

function ExampleMenuItem() {
  const { closeMenu } = useDropdownMenuStore();
  return <MenuItem onClick={closeMenu}>{menuItemText}</MenuItem>;
}

function TestDropdownMenuProvider() {
  return (
    <DropdownMenuProviderComponent isOpenToStart={false}>
      <DropdownMenuButton menuID={menuID}>{menuButtonText}</DropdownMenuButton>
      <DropdownMenu id={menuID}>
        <ExampleMenuItem />
      </DropdownMenu>
    </DropdownMenuProviderComponent>
  );
}

test('clicking menu button should open menu', () => {
  render(<TestDropdownMenuProvider />);

  expect(screen.queryByText(menuItemText)).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button'));
  expect(screen.getByText(menuItemText)).toBeInTheDocument();
});

test('menu button has correct aria-controls attribute', () => {
  render(<TestDropdownMenuProvider />);

  const menuButton = screen.getByRole('button');

  expect(menuButton).not.toHaveAttribute('aria-controls');
  fireEvent.click(menuButton);
  expect(menuButton).toHaveAttribute('aria-controls', menuID);
});
