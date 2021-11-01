import React from 'react';
import { RefinementListFilter, RangeFilter, CheckboxFilter, HierarchicalMenuFilter } from 'searchkit';

import FilterInnerAccordion from 'js/components/Search/filters/FilterInnerAccordion';
import HierarchicalFilterItem from 'js/components/Search/filters/HierarchicalFilterItem';
import CheckboxFilterItem from 'js/components/Search/filters/CheckboxFilterItem';

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

function AccordionFilter({ type, ...rest }) {
  const { Filter, itemComponent } = getFilter(type);
  const item = itemComponent ? { itemComponent } : {};
  return <Filter containerComponent={FilterInnerAccordion} {...rest} {...item} />;
}

export default AccordionFilter;
