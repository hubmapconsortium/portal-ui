import React from 'react';
// Plain RTL render: a composed story already carries the preview's `Providers` decorator,
// so wrapping it again in the one from test-utils would nest two of them.
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from 'test-utils/storybook';

import * as stories from './DropdownMenuProvider.stories';

// The story already wires a button, a menu and a menu item together; `menuID` and friends are
// exported from it (and excluded from the story list) for exactly this reason.
const { DropdownMenuProvider } = composeStories(stories);
const { menuID, menuItemText } = stories;

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
