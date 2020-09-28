/* eslint-disable import/no-unresolved */
import React from 'react';
import { render, screen } from 'test-utils/functions';

import EntityHeaderContent from './EntityHeaderContent';

test('should handle defined and undefined values', () => {
  const data = { fake1: { value: 'fake1', label: 'fake1' }, fake2: { value: undefined, label: 'fake2' } };
  render(<EntityHeaderContent data={data} entity_type="fake-entity-type" />);

  expect(screen.getByText('fake1')).toBeInTheDocument();
  expect(screen.getByText('undefined fake2')).toBeInTheDocument();
});

test('should not display when summary is in view', () => {
  const data = { fake1: { value: 'fake1', label: 'fake1' }, fake2: { value: undefined, label: 'fake2' } };
  render(<EntityHeaderContent data={data} entity_type="fake-entity-type" summaryInView />);

  expect(screen.queryByText('fake1')).toBeNull();
  expect(screen.queryByText('undefined fake2')).toBeNull();
});
