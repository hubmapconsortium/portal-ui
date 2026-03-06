import React from 'react';
import { render, screen, fireEvent } from 'test-utils/functions';

import { DropdownMenuProvider, menuItemText, menuID } from './DropdownMenuProvider.stories';

test('clicking menu button should open menu', () => {
  render(<DropdownMenuProvider />);

  expect(screen.queryByText(menuItemText)).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button'));
  expect(screen.getByText(menuItemText)).toBeInTheDocument();
});

test('menu button has correct aria-controls attribute', () => {
  render(<DropdownMenuProvider />);

  const menuButton = screen.getByRole('button');

  expect(menuButton).not.toHaveAttribute('aria-controls');
  fireEvent.click(menuButton);
  expect(menuButton).toHaveAttribute('aria-controls', menuID);
});
