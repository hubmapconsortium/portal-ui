/* eslint-disable import/no-unresolved */
import { RefinementListFilter, RangeFilter, CheckboxFilter, HierarchicalMenuFilter } from 'searchkit';

import { getFilter } from './AccordionFilter';

test.each([
  ['AccordionListFilter', RefinementListFilter],
  ['AccordionRangeFilter', RangeFilter],
  ['AccordionCheckboxFilter', CheckboxFilter],
  ['AccordionHierarchicalMenuFilter', HierarchicalMenuFilter],
])('%s returns correct filter', (filterName, expectedFilter) => {
  expect(getFilter(filterName)).toBe(expectedFilter);
});

test('should throw with unexpected filter name', () => {
  const unknownFilter = 'UnknownFilter';
  expect(() => {
    getFilter(unknownFilter);
  }).toThrow(`"${unknownFilter}" does not exist`);
});
