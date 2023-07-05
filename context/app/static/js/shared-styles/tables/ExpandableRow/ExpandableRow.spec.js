import React from 'react';
import { render, screen } from 'test-utils/functions';
import { fireEvent, waitFor } from '@testing-library/react';

import ExpandableRowCell from 'js/shared-styles/tables/ExpandableRowCell';
import ExpandableRow from './ExpandableRow';

test('should handle user expanding row', async () => {
  const cellsText = ['A', 'B', 'C'];
  render(
    <ExpandableRow numCells={4} expandedContent={<div>123</div>}>
      {cellsText.map((cellText) => (
        <ExpandableRowCell>{cellText}</ExpandableRowCell>
      ))}
    </ExpandableRow>,
  );
  cellsText.forEach((cellText) => expect(screen.getByText(cellText)).not.toHaveStyle('border-bottom: none'));
  expect(screen.getByTestId('down-arrow-icon')).toBeInTheDocument();
  expect(screen.getByText('123')).not.toBeVisible();

  fireEvent.click(screen.getByLabelText('expand row'));

  await waitFor(() => {
    expect(screen.getByText('123')).toBeVisible();
  });

  cellsText.forEach((cellText) => expect(screen.getByText(cellText)).toHaveStyle('border-bottom: none'));
  expect(screen.getByTestId('up-arrow-icon')).toBeInTheDocument();
});
