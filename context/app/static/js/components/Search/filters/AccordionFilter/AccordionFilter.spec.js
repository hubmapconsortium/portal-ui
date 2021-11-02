/* eslint-disable import/no-unresolved */
import React from 'react';
import { RefinementListFilter, RangeFilter, CheckboxFilter, HierarchicalMenuFilter } from 'searchkit';
import { render } from 'test-utils/functions';

import HierarchicalFilterItem from 'js/components/Search/filters/HierarchicalFilterItem';
import CheckboxFilterItem from 'js/components/Search/filters/CheckboxFilterItem';

import AccordionFilter, { getFilter } from './AccordionFilter';

test.each([
  ['AccordionListFilter', { Filter: RefinementListFilter, itemComponent: CheckboxFilterItem }],
  ['AccordionRangeFilter', { Filter: RangeFilter }],
  ['AccordionCheckboxFilter', { Filter: CheckboxFilter, itemComponent: CheckboxFilterItem }],
  ['AccordionHierarchicalMenuFilter', { Filter: HierarchicalMenuFilter, itemComponent: HierarchicalFilterItem }],
])('%s returns correct filter', (filterName, expectedFilter) => {
  expect(getFilter(filterName)).toStrictEqual(expectedFilter);
});

test('should throw with unexpected filter name', () => {
  const unknownFilter = 'UnknownFilter';
  expect(() => {
    getFilter(unknownFilter);
  }).toThrow(`"${unknownFilter}" does not exist`);
});

test.each([
  ['AccordionListFilter'],
  ['AccordionRangeFilter'],
  ['AccordionCheckboxFilter'],
  ['AccordionHierarchicalMenuFilter'],
])('%s should render', (filterName) => {
  render(<AccordionFilter type={filterName} />);
});
