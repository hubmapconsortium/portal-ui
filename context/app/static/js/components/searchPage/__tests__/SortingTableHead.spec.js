import React from 'react';
// eslint-disable-next-line
import { render, screen } from 'test-utils/functions';

import SortingTableHead from '../SortingTableHead';

test('SortingTableHead renders', () => {
  const items = [
    {
      defaultOption: false,
      field: 'FIELD',
      key: 'FIELD_desc',
      label: 'LABEL',
      order: 'desc',
    },
    {
      defaultOption: false,
      field: 'FIELD',
      key: 'FIELD_asc',
      label: 'LABEL',
      order: 'asc',
    },
  ];
  const selectedItems = [];

  render(
    // Wrap with <table> to avoid DOM nesting error:
    <table>
      <SortingTableHead items={items} toggleItem={() => {}} selectedItems={selectedItems} />
    </table>,
  );
  expect(screen.getByText('LABEL')).toBeInTheDocument();
});
