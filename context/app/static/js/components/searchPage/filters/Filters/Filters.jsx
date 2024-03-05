import React from 'react';
import PropTypes from 'prop-types';

import AccordionFilter from 'js/components/searchPage/filters/AccordionFilter';
import FilterOuterAccordion from 'js/components/searchPage/filters/FilterOuterAccordion';

function Filters({ filters, analyticsCategory }) {
  return Object.entries(filters).map(([title, filterGroup], i) => {
    const innerAccordions = filterGroup.map((def) => {
      return (
        <AccordionFilter
          type={def.type}
          {...def.props}
          itemProps={def?.itemProps}
          key={`title-${def.props.title}`}
          analyticsCategory={analyticsCategory}
        />
      );
    });
    if (!title) {
      // We leave the title blank for the group of facets
      // that need to be on the page for Searchkit,
      // but that we don't want to display.
      return (
        <div style={{ display: 'none' }} key="hidden-because-title-blank">
          {innerAccordions}
        </div>
      );
    }
    return <FilterOuterAccordion key={title} title={title} isFirst={i === 0} innerAccordions={innerAccordions} />;
  });
}

Filters.propTypes = {
  filters: PropTypes.objectOf(PropTypes.array).isRequired,
};

export default Filters;
