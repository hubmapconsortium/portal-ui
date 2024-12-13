import React from 'react';

import { render, screen } from 'test-utils/functions';

import SelectedFilter from '../SelectedFilter';

test('SelectedFilter renders "key: value"', () => {
  render(<SelectedFilter labelKey="key" labelValue="value" removeFilter={() => {}} filterId="not_entity_type" />);
  expect(screen.getByText(/key/)).toBeInTheDocument();
  expect(screen.getByText(/value/)).toBeInTheDocument();
});

test('but SelectedFilter does not render entity_type', () => {
  render(<SelectedFilter labelKey="key" labelValue="value" removeFilter={() => {}} filterId="entity_type" />);
  expect(screen.queryByText(/key/)).not.toBeInTheDocument();
  expect(screen.queryByText(/value/)).not.toBeInTheDocument();
});
