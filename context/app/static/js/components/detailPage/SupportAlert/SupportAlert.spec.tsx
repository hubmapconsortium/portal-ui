import React from 'react';
import { render, screen } from 'test-utils/functions';
import { buildSearchLink } from 'js/components/search/store';
import SupportAlert from './SupportAlert';

test('The alert links to parent dataset on search page', () => {
  const fakeUUID = 'abc123';
  const hrefToTest = buildSearchLink({
    entity_type: 'Dataset',
    filters: {
      descendant_ids: {
        values: [fakeUUID],
        type: 'TERM',
      },
    },
  });
  render(<SupportAlert uuid={fakeUUID} isSupport />);

  expect(screen.getByText('the parent dataset')).toHaveAttribute('href', hrefToTest);
});
