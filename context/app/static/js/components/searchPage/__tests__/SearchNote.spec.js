import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { render, screen } from 'test-utils/functions';

import SearchNote from '../SearchNote';

test('SearchNote renders', () => {
  const entity = {
    uuid: 'FAKE_UUID',
    entity_type: 'FAKE_TYPE',
    hubmap_id: 'FAKE_DOI',
  };
  render(<SearchNote entity={entity} label="Derived from" />);
  expect(screen.getByText('Derived from fake_type')).toBeInTheDocument();
  const link = screen.getByText('FAKE_DOI');
  expect(link.href).toBe('http://localhost/browse/fake_type/FAKE_UUID');
});
