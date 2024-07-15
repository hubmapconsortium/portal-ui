import React from 'react';
import { render, screen } from 'test-utils/functions';
import SupportAlert from './SupportAlert';

test('The alert links to parent dataset on search page', () => {
  const fakeUUID = 'abc123';
  const hrefToTest = `/search?descendant_ids[0]=${fakeUUID}&entity_type[0]=Dataset`;
  render(<SupportAlert uuid={fakeUUID} isSupport />);

  expect(screen.getByText('the parent dataset')).toHaveAttribute('href', hrefToTest);
});
