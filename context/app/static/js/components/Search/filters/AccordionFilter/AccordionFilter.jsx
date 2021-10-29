import React from 'react';
import { RefinementListFilter, RangeFilter, CheckboxFilter, HierarchicalMenuFilter } from 'searchkit';

import FilterInnerAccordion from 'js/components/Search/filters/FilterInnerAccordion';

function getFilter(type) {
  switch (type) {
    case 'AccordionListFilter':
      return RefinementListFilter;
    case 'AccordionRangeFilter':
      return RangeFilter;
    case 'AccordionCheckboxFilter':
      return CheckboxFilter;
    case 'AccordionHierarchicalMenuFilter':
      return HierarchicalMenuFilter;
    default:
      throw new Error(`"${type}" does not exist`);
  }
}

function AccordionFilter({ type, ...rest }) {
  const Filter = getFilter(type);
  return <Filter containerComponent={FilterInnerAccordion} {...rest} />;
}

export default AccordionFilter;
