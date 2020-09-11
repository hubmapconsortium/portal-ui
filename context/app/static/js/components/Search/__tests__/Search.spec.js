import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { render } from 'test-utils/functions';

import Search from '../Search';

test('Search error if no URL param', () => {
  expect(() => render(<Search elasticsearchEndpoint="not-used" title="not-used" />)).toThrow(
    'Unexpected URL param "entity_type[0]="; Should be one of {donor, sample, dataset}',
  );
});
