import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { render } from 'test-utils/functions';
import { screen } from '@testing-library/react';

import SelectedFilter from '../SelectedFilter';

test('SelectedFilter renders "key: value"', () => {
  render(<SelectedFilter labelKey="key" labelValue="value" removeFilter={() => {}} filterId="not_entity_type" />);
  expect(screen.getBy(/key/)).toBeInTheDocument();
  expect(screen.getBy(/value/)).toBeInTheDocument();
});

test('but SelectedFilter does not render entity_type', () => {
  render(<SelectedFilter labelKey="key" labelValue="value" removeFilter={() => {}} filterId="entity_type" />);
  expect(screen.queryByText(/key/)).not.toBeInTheDocument();
  expect(screen.queryByText(/value/)).not.toBeInTheDocument();
});
