import React from 'react';
import { render, screen } from 'test-utils/functions';
import userEvent from '@testing-library/user-event';

import TilesSortDropdown from './TilesSortDropdown';

const items = [
  {
    defaultOption: false,
    label: 'Fake',
    field: 'fake.keyword',
    order: 'desc',
    key: 'fake.keyword_desc',
  },
  {
    defaultOption: false,
    label: 'Fake',
    field: 'Fake.keyword',
    order: 'asc',
    key: 'fake.keyword_asc',
  },
  {
    defaultOption: true,
    label: 'Last Modified',
    field: 'mapped_last_modified_timestamp.keyword',
    order: 'desc',
    key: 'mapped_last_modified_timestamp.keyword_desc',
  },
  {
    defaultOption: false,
    label: 'Last Modified',
    field: 'mapped_last_modified_timestamp.keyword',
    order: 'asc',
    key: 'mapped_last_modified_timestamp.keyword_asc',
  },
];

test('should handle open and toggling new item', () => {
  const mockToggle = jest.fn();
  const selectedItems = ['mapped_last_modified_timestamp.keyword_desc'];

  render(
    <TilesSortDropdown
      toggleItem={mockToggle}
      items={items}
      selectedItems={selectedItems}
      analyticsCategory="this is required"
    />,
  );
  userEvent.click(screen.getByText('Last Modified'));
  userEvent.click(screen.getByText('Fake'));

  expect(mockToggle).toHaveBeenCalled();
  expect(mockToggle).toHaveBeenCalledWith('fake.keyword_asc');
});

test('should toggle descending order for last modified', async () => {
  const mockToggle = jest.fn();
  const selectedItems = ['fake.keyword_desc'];

  render(
    <TilesSortDropdown
      toggleItem={mockToggle}
      items={items}
      selectedItems={selectedItems}
      analyticsCategory="this is required"
    />,
  );
  userEvent.click(screen.getByText('Fake'));
  userEvent.click(screen.getByText('Last Modified'));

  expect(mockToggle).toHaveBeenCalled();
  expect(mockToggle).toHaveBeenCalledWith('mapped_last_modified_timestamp.keyword_desc');
});
