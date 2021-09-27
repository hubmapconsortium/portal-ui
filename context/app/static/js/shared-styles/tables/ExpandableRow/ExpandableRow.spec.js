/* eslint-disable import/no-unresolved */
import React from 'react';
import { render, screen } from 'test-utils/functions';
import { fireEvent } from '@testing-library/react';

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

  fireEvent.click(screen.getByLabelText('expand row'));

  await screen.findByText('123');

  cellsText.forEach((cellText) => expect(screen.getByText(cellText)).toHaveStyle('border-bottom: none'));
  expect(screen.getByTestId('up-arrow-icon')).toBeInTheDocument();
});
