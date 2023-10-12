import React from 'react';
import { render, screen, fireEvent } from 'test-utils/functions';

import { SelectableTableProvider, tableLabel, rowKeys } from './SelectableTableProvider.stories';

test('should handle clicking header checkbox', () => {
  render(<SelectableTableProvider tableLabel={tableLabel} />);

  const headerCheckboxLabel = `${tableLabel}-header-row-checkbox`;

  screen.getAllByRole('checkbox').forEach((checkbox) => expect(checkbox).not.toBeChecked());
  fireEvent.click(screen.getByLabelText(headerCheckboxLabel));
  screen.getAllByRole('checkbox').forEach((checkbox) => expect(checkbox).toBeChecked());
  fireEvent.click(screen.getByLabelText(headerCheckboxLabel));
  screen.getAllByRole('checkbox').forEach((checkbox) => expect(checkbox).not.toBeChecked());
});

test('should handle clicking body row checkbox', () => {
  render(<SelectableTableProvider tableLabel={tableLabel} />);

  const firstRowCheckboxLabel = `${tableLabel}-row-${rowKeys[0]}-checkbox`;
  expect(screen.getByLabelText(firstRowCheckboxLabel)).not.toBeChecked();
  fireEvent.click(screen.getByLabelText(firstRowCheckboxLabel));
  expect(screen.getByLabelText(firstRowCheckboxLabel)).toBeChecked();
});
