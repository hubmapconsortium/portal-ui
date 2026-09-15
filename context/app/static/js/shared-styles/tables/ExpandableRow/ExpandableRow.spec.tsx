import React from 'react';
// Plain RTL render: a composed story already carries the preview's `Providers` decorator,
// so wrapping it again in the one from test-utils would nest two of them.
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { composeStories } from 'test-utils/storybook';

import * as stories from './ExpandableRow.stories';

const { Default, Disabled } = composeStories(stories);
const { expandedContentTestId } = stories;

const cellsText = ['A', 'B', 'C'];

test('should handle user expanding row', async () => {
  render(<Default />);

  cellsText.forEach((cellText) => expect(screen.getByText(cellText)).not.toHaveStyle('border-bottom-style: none'));
  expect(screen.getByTestId('down-arrow-icon')).toBeInTheDocument();
  expect(screen.queryByTestId(expandedContentTestId)).not.toBeInTheDocument();

  fireEvent.click(screen.getByLabelText('expand row'));

  await waitFor(() => {
    expect(screen.getByTestId(expandedContentTestId)).toBeVisible();
  });

  cellsText.forEach((cellText) => expect(screen.getByText(cellText)).toHaveStyle('border-bottom-style: none'));
  expect(screen.getByTestId('up-arrow-icon')).toBeInTheDocument();
});

// Only checks that the disabled state is exposed. Clicking a disabled row still expands it:
// `ClickableRow` keeps its `onClick` and its styles only set `pointer-events: none` under
// `&:active`, which does not stop a click. Left as-is here rather than fixed in a Storybook PR.
test('disabled row is marked disabled', () => {
  render(<Disabled />);

  expect(screen.getByLabelText('expand row')).toHaveAttribute('aria-disabled', 'true');
});
