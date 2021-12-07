import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { render } from 'test-utils/functions';

import SearchNote from '../SearchNote';

test('SearchNote renders', () => {
  const entity = {
    uuid: 'FAKE_UUID',
    entity_type: 'FAKE_TYPE',
    hubmap_id: 'FAKE_DOI',
  };
  const { getByText } = render(<SearchNote entity={entity} label="Derived from" />);
  expect(getByText('Derived from fake_type')).toBeInTheDocument();
  const link = getByText('FAKE_DOI');
  expect(link.href).toBe('http://localhost/browse/fake_type/FAKE_UUID');
});
