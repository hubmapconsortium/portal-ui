import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { render } from 'test-utils/functions';
import { SearchkitProvider, SearchkitManager } from 'searchkit';

import Accordions from '../Accordions';

test('Accordions renders', () => {
  const filters = {
    'Section Title': [],
  };
  const searchkit = SearchkitManager.mock();
  render(
    <SearchkitProvider searchkit={searchkit}>
      <Accordions filters={filters} />
    </SearchkitProvider>,
  );
  expect(screen.getByText('Section Title')).toBeInTheDocument();
});
