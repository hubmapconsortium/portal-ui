/* eslint-disable import/no-unresolved */
import React from 'react';
import { RefinementListFilter, RangeFilter, CheckboxFilter, HierarchicalMenuFilter } from 'searchkit';
import { render, screen, fireEvent } from 'test-utils/functions';
import ReactGA from 'react-ga';

import HierarchicalFilterItem from 'js/components/Search/filters/HierarchicalFilterItem';
import CheckboxFilterItem from 'js/components/Search/filters/CheckboxFilterItem';

import AccordionFilter, { withAnalyticsEvent, getFilter } from './AccordionFilter';

test.each([
  ['AccordionListFilter', { Filter: RefinementListFilter, itemComponent: CheckboxFilterItem }],
  ['AccordionRangeFilter', { Filter: RangeFilter }],
  ['AccordionCheckboxFilter', { Filter: CheckboxFilter, itemComponent: CheckboxFilterItem }],
  ['AccordionHierarchicalMenuFilter', { Filter: HierarchicalMenuFilter, itemComponent: HierarchicalFilterItem }],
])('getFilter given %s returns correct filter', (filterName, expectedFilter) => {
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

jest.mock('react-ga');

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

  const UpdatedComponent = withAnalyticsEvent(originalComponent, 'Click me!');
  render(<UpdatedComponent onClick={originalOnClick} somethingElse="World" />);

  fireEvent.click(screen.getByText('Click me!'));
  expect(ReactGA.event).toHaveBeenCalledTimes(1);
  expect(originalOnClick).toHaveBeenCalledTimes(1);
  expect(screen.getByText('World')).toBeInTheDocument();
});
