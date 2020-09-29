import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { render } from 'test-utils/functions';

import Search from './Search';

test('Search error if missing entity_type param', () => {
  // TODO: I want to supressed the log noise during this test... but this doesn't work. :(
  global.console = { error: jest.fn().mockImplementation(() => {}) };

  expect(() => render(<Search elasticsearchEndpoint="not-used" title="not-used" />)).toThrow(
    'Unexpected URL param "entity_type[0]="; Should be one of {donor, sample, dataset}',
  );
});

// test('Search works with entity_type param', () => {
//   expect(() => render(<Search elasticsearchEndpoint="not-used" title="not-used" />)).toThrow(
//     'Unexpected URL param "entity_type[0]="; Should be one of {donor, sample, dataset}',
//   );
// });
