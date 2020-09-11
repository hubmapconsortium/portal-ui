import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { OuterAccordion, OuterAccordionSummary, OuterAccordionDetails } from './style';
import accordionFilters from './accordionFilters';

function Accordions(props) {
  const { filters } = props;
  return Object.entries(filters).map(([title, filterGroup], i) => {
    const isFirst = i === 0;
    const innerAccordion = filterGroup.map((def) => {
      if (!(def.type in accordionFilters)) {
        throw new Error(`"${def.type}" not in {${Object.keys(accordionFilters).join(', ')}}`);
      }
      const Filter = accordionFilters[def.type];
      // eslint-disable-next-line react/jsx-props-no-spreading
      return <Filter {...def.props} key={`title-${def.props.title}`} />;
    });
    if (!title) {
      // We leave the title blank for the group of facets
      // that need to be on the page for Searchkit,
      // but that we don't want to display.
      return (
        <div style={{ display: 'none' }} key="hidden-because-title-blank">
          {innerAccordion}
        </div>
      );
    }
    return (
      <OuterAccordion key={title} defaultExpanded={isFirst}>
        <OuterAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{title}</Typography>
        </OuterAccordionSummary>
        <OuterAccordionDetails>{innerAccordion}</OuterAccordionDetails>
      </OuterAccordion>
    );
  });
}

Accordions.propTypes = {
  filters: PropTypes.objectOf(PropTypes.array).isRequired,
};

export default Accordions;
