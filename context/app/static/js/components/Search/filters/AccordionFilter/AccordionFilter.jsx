import React from 'react';
import { RefinementListFilter, RangeFilter, CheckboxFilter, HierarchicalMenuFilter } from 'searchkit';
import ReactGA from 'react-ga';

import FilterInnerAccordion from 'js/components/Search/filters/FilterInnerAccordion';
import HierarchicalFilterItem from 'js/components/Search/filters/HierarchicalFilterItem';
import CheckboxFilterItem from 'js/components/Search/filters/CheckboxFilterItem';

export function withAnalyticsEvent(ItemComponent, title) {
  return function UpdatedItemComponent({ onClick: originalOnClick, label, ...rest }) {
    function updatedOnClick() {
      ReactGA.event({
        category: 'Search Page Interactions',
        action: 'Facet',
        label: `${title}: ${label}`,
      });
      originalOnClick();
    }
    return <ItemComponent onClick={updatedOnClick} label={label} {...rest} />;
  };
}

export function getFilter(type) {
  switch (type) {
    case 'AccordionListFilter':
      return { Filter: RefinementListFilter, itemComponent: CheckboxFilterItem };
    case 'AccordionRangeFilter':
      return { Filter: RangeFilter };
    case 'AccordionCheckboxFilter':
      return { Filter: CheckboxFilter, itemComponent: CheckboxFilterItem };
    case 'AccordionHierarchicalMenuFilter':
      return { Filter: HierarchicalMenuFilter, itemComponent: HierarchicalFilterItem };
    default:
      throw new Error(`"${type}" does not exist`);
  }
}

function AccordionFilter({ type, title, ...rest }) {
  const { Filter, itemComponent } = getFilter(type);
  const item = itemComponent ? { itemComponent: withAnalyticsEvent(itemComponent, title) } : {};
  return <Filter containerComponent={FilterInnerAccordion} title={title} {...rest} {...item} />;
}

export default AccordionFilter;
