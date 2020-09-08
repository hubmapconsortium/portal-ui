import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { render } from 'test-utils/functions';
import { SearchkitProvider, SearchkitManager } from 'searchkit';

import Accordions from '../Accordions';

test('Accordions renders', () => {
  const filters = {
    '': [], // display: none;
    'Visible Accordion': [],
  };
  const searchkit = SearchkitManager.mock();
  const { getByText } = render(
    <SearchkitProvider searchkit={searchkit}>
      <Accordions filters={filters} />
    </SearchkitProvider>,
  );
  expect(getByText('Visible Accordion')).toBeInTheDocument();
});
