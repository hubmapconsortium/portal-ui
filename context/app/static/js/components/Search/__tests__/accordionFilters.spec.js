import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { render } from 'test-utils/functions';
import { SearchkitProvider, SearchkitManager } from 'searchkit';

import accordionFilters from '../accordionFilters';

test('default export has the right keys', () => {
  expect(Object.keys(accordionFilters).sort()).toEqual([
    'AccordionCheckboxFilter',
    'AccordionListFilter',
    'AccordionRangeFilter',
  ]);
});

test('empty AccordionListFilter', () => {
  const { AccordionListFilter } = accordionFilters;
  const searchkit = SearchkitManager.mock();
  const { container } = render(
    <SearchkitProvider searchkit={searchkit}>
      <AccordionListFilter id="ID" title="TITLE" field="FIELD" operator="OR" size={42} />
    </SearchkitProvider>,
  );
  expect(container).toMatchInlineSnapshot(`<div />`);
});
