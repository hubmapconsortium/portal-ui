import React from 'react';
import { RefinementListFilter, RangeFilter, CheckboxFilter } from 'searchkit';
import { trackEvent } from 'js/helpers/trackers';

import FilterInnerAccordion from 'js/components/searchPage/filters/FilterInnerAccordion';
import CheckboxFilterItem from 'js/components/searchPage/filters/CheckboxFilterItem';
import HierarchicalMenuFilter from 'js/components/searchPage/HierarchicalMenuFilter';
import AlphabetizedRefinementListFilter from './AlphabetizedRefinementListFilter';

export function withAnalyticsEvent(ItemComponent, title, analyticsCategory, configItemProps) {
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
    return (
      <ItemComponent
        onClick={updatedOnClick}
        label={label}
        active={active}
        {...rest}
        configItemProps={configItemProps}
      />
    );
  };
}

export function getFilter(type, shouldAlphabetize = false) {
  switch (type) {
    case 'AccordionListFilter':
      return {
        Filter: shouldAlphabetize ? AlphabetizedRefinementListFilter : RefinementListFilter,
        itemComponent: CheckboxFilterItem,
      };
    case 'AccordionRangeFilter':
      return { Filter: RangeFilter };
    case 'AccordionCheckboxFilter':
      return { Filter: CheckboxFilter, itemComponent: CheckboxFilterItem };
    case 'AccordionHierarchicalMenuFilter':
      return { Filter: HierarchicalMenuFilter, itemComponent: CheckboxFilterItem };
    default:
      throw new Error(`"${type}" does not exist`);
  }
}

function AccordionFilter({ type, title, analyticsCategory, itemProps, ...rest }) {
  const shouldAlphabetize = type === 'AccordionListFilter' && rest?.orderKey === '_term';
  const { Filter, itemComponent } = getFilter(type, shouldAlphabetize);
  const item = itemComponent
    ? { itemComponent: withAnalyticsEvent(itemComponent, title, analyticsCategory, itemProps) }
    : {};
  return <Filter containerComponent={FilterInnerAccordion} title={title} {...rest} {...item} />;
}

export default AccordionFilter;
