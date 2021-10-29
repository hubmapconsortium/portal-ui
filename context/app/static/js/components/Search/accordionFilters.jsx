import React from 'react';
import { RefinementListFilter, RangeFilter, CheckboxFilter, HierarchicalMenuFilter } from 'searchkit';
import PropTypes from 'prop-types';

import FilterInnerAccordion from './filters/FilterInnerAccordion';

function AccordionHierarchicalMenuFilter(props) {
  const innerProps = {
    containerComponent: FilterInnerAccordion,
    ...props,
  };
  return <HierarchicalMenuFilter {...innerProps} />;
}

AccordionHierarchicalMenuFilter.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired,
};

function AccordionListFilter(props) {
  const innerProps = {
    containerComponent: FilterInnerAccordion,
    ...props,
  };
  return <RefinementListFilter {...innerProps} />;
}

AccordionListFilter.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  field: PropTypes.string.isRequired,
  operator: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
};

function AccordionRangeFilter(props) {
  const innerProps = {
    containerComponent: FilterInnerAccordion,
    ...props,
  };
  return <RangeFilter {...innerProps} />;
}

AccordionRangeFilter.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  field: PropTypes.string.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  showHistogram: PropTypes.bool.isRequired,
};

function AccordionCheckboxFilter(props) {
  const innerProps = {
    containerComponent: FilterInnerAccordion,
    ...props,
  };
  return <CheckboxFilter {...innerProps} />;
}

AccordionCheckboxFilter.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  filter: PropTypes.object.isRequired,
};

export default { AccordionHierarchicalMenuFilter, AccordionListFilter, AccordionRangeFilter, AccordionCheckboxFilter };
