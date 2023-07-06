import React from 'react';
import { render, screen } from 'test-utils/functions';

import LoadingTableRows from './LoadingTableRows';

const numberOfRows = 3;
const numberOfCols = 5;
test('should display correct number of rows and cells', () => {
  render(<LoadingTableRows numberOfRows={numberOfRows} numberOfCols={numberOfCols} />);

  expect(screen.getAllByRole('row').length).toBe(numberOfRows);
  expect(screen.getAllByRole('cell').length).toBe(numberOfRows * numberOfCols);
});
