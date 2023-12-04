import React from 'react';
import { RefinementListFilter, RangeFilter, CheckboxFilter, HierarchicalMenuFilter } from 'searchkit';
import { trackEvent } from 'js/helpers/trackers';

import FilterInnerAccordion from 'js/components/searchPage/filters/FilterInnerAccordion';
import HierarchicalFilterItem from 'js/components/searchPage/filters/HierarchicalFilterItem';
import CheckboxFilterItem from 'js/components/searchPage/filters/CheckboxFilterItem';
import AlphabetizedRefinementListFilter from './AlphabetizedRefinementListFilter';

export function withAnalyticsEvent(ItemComponent, title, analyticsCategory) {
  return function UpdatedItemComponent({ onClick: originalOnClick, label, active, ...rest }) {
    const facetAction = active ? 'Unselect' : 'Select';
    function updatedOnClick() {
      trackEvent({
        category: analyticsCategory,
        action: `${facetAction} Facet`,
        label: `${title}: ${label}`,
      });
      originalOnClick();
    }
    return <ItemComponent onClick={updatedOnClick} label={label} active={active} {...rest} />;
  };
}

const facetsToAlphabetize = ['Data Type'];

export function getFilter(type, title) {
  switch (type) {
    case 'AccordionListFilter':
      return {
        Filter: facetsToAlphabetize.includes(title) ? AlphabetizedRefinementListFilter : RefinementListFilter,
        itemComponent: CheckboxFilterItem,
      };
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

function AccordionFilter({ type, title, analyticsCategory, ...rest }) {
  const { Filter, itemComponent } = getFilter(type, title);
  const item = itemComponent ? { itemComponent: withAnalyticsEvent(itemComponent, title, analyticsCategory) } : {};
  return <Filter containerComponent={FilterInnerAccordion} title={title} {...rest} {...item} />;
}

export default AccordionFilter;
