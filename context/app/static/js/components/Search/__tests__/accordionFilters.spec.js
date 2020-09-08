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

test('title comes through AccordionListFilter', () => {
  const { AccordionListFilter } = accordionFilters;
  const searchkit = SearchkitManager.mock();
  const { getByText } = render(
    <SearchkitProvider searchkit={searchkit}>
      <AccordionListFilter id="ID" title="TITLE" field="FIELD" operator="OR" size={42} />
    </SearchkitProvider>,
  );
  expect(getByText('TITLE')).toBeInTheDocument();
});

test('title comes through AccordionRangeFilter', () => {
  const { AccordionRangeFilter } = accordionFilters;
  const searchkit = SearchkitManager.mock();
  const { getByText } = render(
    <SearchkitProvider searchkit={searchkit}>
      <AccordionRangeFilter id="ID" title="TITLE" field="FIELD" operator="OR" min={0} max={42} showHistogram />
    </SearchkitProvider>,
  );
  expect(getByText('TITLE')).toBeInTheDocument();
});

test('title comes through AccordionCheckboxFilter', () => {
  const { AccordionCheckboxFilter } = accordionFilters;
  const searchkit = SearchkitManager.mock();
  const { getByText } = render(
    <SearchkitProvider searchkit={searchkit}>
      <AccordionCheckboxFilter id="ID" title="TITLE" field="FIELD" operator="OR" size={42} filter={{}} label="LABEL" />
    </SearchkitProvider>,
  );
  expect(getByText('TITLE')).toBeInTheDocument();
});
