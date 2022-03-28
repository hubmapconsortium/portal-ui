/* eslint-disable import/no-unresolved */
import React from 'react';
import { render, screen } from 'test-utils/functions';

import EntityHeaderContent from './EntityHeaderContent';

const data = { fake1: { value: 'fake1', label: 'fake1' }, fake2: { value: undefined, label: 'fake2' } };

test('should handle defined and undefined values', () => {
  render(<EntityHeaderContent data={data} entity_type="fake-entity-type" shouldDisplayHeader />);

  expect(screen.getByText('fake1')).toBeInTheDocument();
  expect(screen.getByText('undefined fake2')).toBeInTheDocument();
});

test('json button exists and has href', () => {
  const testUUID = 'fakeuuid';
  render(<EntityHeaderContent entity_type="Fake" uuid={testUUID} />);

  expect(screen.getByRole('link')).not.toBeEmptyDOMElement();
  expect(screen.getByRole('link')).toHaveAttribute('href', `/browse/fake/fakeuuid.json`);
});
