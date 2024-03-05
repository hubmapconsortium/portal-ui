import React from 'react';
import { RefinementListFilter, RangeFilter, CheckboxFilter } from 'searchkit';
import { render, screen, fireEvent } from 'test-utils/functions';
import { trackEvent } from 'js/helpers/trackers';

import CheckboxFilterItem from 'js/components/searchPage/filters/CheckboxFilterItem';
import AccordionFilter, { withAnalyticsEvent, getFilter } from './AccordionFilter';
import AlphabetizedRefinementListFilter from './AlphabetizedRefinementListFilter';
import HierarchicalMenuFilter from '../../HierarchicalMenuFilter';

jest.mock('js/helpers/trackers');

test.each([
  ['AccordionListFilter', { Filter: RefinementListFilter, itemComponent: CheckboxFilterItem }, false],
  ['AccordionListFilter', { Filter: AlphabetizedRefinementListFilter, itemComponent: CheckboxFilterItem }, true],
  ['AccordionRangeFilter', { Filter: RangeFilter }, false],
  ['AccordionCheckboxFilter', { Filter: CheckboxFilter, itemComponent: CheckboxFilterItem }, false],
  ['AccordionHierarchicalMenuFilter', { Filter: HierarchicalMenuFilter, itemComponent: CheckboxFilterItem }, false],
])('getFilter given %s returns correct filter', (filterName, expectedFilter, alphabetize) => {
  expect(getFilter(filterName, alphabetize)).toStrictEqual(expectedFilter);
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
  expect(() => {
    render(<AccordionFilter type={filterName} />);
  }).not.toThrow();
});

test('withAnalyticsEvent passes onClick with ga event and original onClick', () => {
  const originalOnClick = jest.fn();

  function originalComponent({ onClick, somethingElse }) {
    return (
      <>
        <button onClick={onClick} type="button">
          Click me!
        </button>
        <div>{somethingElse}</div>
      </>
    );
  }

  const UpdatedComponent = withAnalyticsEvent(originalComponent, 'Click me!', 'category required');
  render(<UpdatedComponent onClick={originalOnClick} somethingElse="World" />);

  fireEvent.click(screen.getByText('Click me!'));
  expect(trackEvent).toHaveBeenCalledTimes(1);
  expect(originalOnClick).toHaveBeenCalledTimes(1);
  expect(screen.getByText('World')).toBeInTheDocument();
});
