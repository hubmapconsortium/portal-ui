import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { render } from 'test-utils/functions';

import Search from './Search';

test('Search error if missing entity_type param', () => {
  const originalConsoleError = console.error;
  console.error = jest.fn();

  expect(() => render(<Search elasticsearchEndpoint="not-used" title="not-used" />)).toThrow(
    'Unexpected URL param "entity_type[0]="; Should be one of {donor, sample, dataset}',
  );

  console.error = originalConsoleError;
});

test('Search works with entity_type param', () => {
  // Tried a few approaches: This is based on https://www.grzegorowski.com/how-to-mock-global-window-with-jest
  const originalWindow = { ...window };
  const windowSpy = jest.spyOn(global, 'window', 'get');
  windowSpy.mockImplementation(() => ({
    ...originalWindow,
    location: {
      ...originalWindow.location,
      search: '?entity_type[0]=Donor',
    },
  }));

  // const { container } =
  render(<Search elasticsearchEndpoint="not-used" title="not-used" />);
  // Fails with "TypeError: Right-hand side of 'instanceof' is not an object"
  // from react-dom.development.js

  // TODO: Test the container!

  windowSpy.mockRestore();
});
