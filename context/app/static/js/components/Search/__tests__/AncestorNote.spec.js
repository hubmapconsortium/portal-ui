import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { render } from 'test-utils/functions';

import AncestorNote from '../AncestorNote';

test('AncestorNote renders', () => {
  const entity = {
    uuid: 'FAKE_UUID',
    entity_type: 'FAKE_TYPE',
    display_doi: 'FAKE_DOI',
  };
  const { getByText } = render(<AncestorNote entity={entity} label="Derived from" />);
  expect(getByText('Derived from fake_type')).toBeInTheDocument();
  const link = getByText('FAKE_DOI');
  expect(link.href).toBe('http://localhost/browse/fake_type/FAKE_UUID');
});
