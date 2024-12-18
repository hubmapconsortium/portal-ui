import React from 'react';

import { render, screen } from 'test-utils/functions';
import { SearchkitProvider, SearchkitManager } from 'searchkit';

import Filters from './Filters';

test('Accordions renders', () => {
  const filters = {
    'Section Title': [],
  };
  const searchkit = SearchkitManager.mock();
  render(
    <SearchkitProvider searchkit={searchkit}>
      <Filters filters={filters} />
    </SearchkitProvider>,
  );
  expect(screen.getByText('Section Title')).toBeInTheDocument();
});
