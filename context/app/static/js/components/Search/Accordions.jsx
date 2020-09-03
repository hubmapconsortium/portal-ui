import React from 'react';
// import PropTypes from 'prop-types';

import * as filterTypes from 'searchkit'; // eslint-disable-line import/no-duplicates
// There is more in the name space, but we only need the filterTypes.

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { InnerAccordion, OuterAccordion, StyledAccordionDetails, StyledAccordionSummary } from './style';

function Accordions(props) {
  const { filters } = props;
  return Object.entries(filters).map(([title, filterGroup]) => {
    const innerAccordion = filterGroup.map((def) => {
      const Filter = filterTypes[def.type];
      /* eslint-disable react/jsx-props-no-spreading */
      return (
        <InnerAccordion key={def.props.title} defaultExpanded>
          <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>{def.props.title}</StyledAccordionSummary>
          <StyledAccordionDetails>
            <Filter {...def.props} />
          </StyledAccordionDetails>
        </InnerAccordion>
      );
      /* eslint-enable react/jsx-props-no-spreading */
    });
    if (!title) {
      // We leave the title blank for the group of facets
      // that need to be on the page for Searchkit,
      // but that we don't want to display.
      return (
        <div style={{ display: 'none' }} key="hidden">
          {innerAccordion}
        </div>
      );
    }
    return (
      <OuterAccordion key={title}>
        <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>{title}</StyledAccordionSummary>
        <StyledAccordionDetails>{innerAccordion}</StyledAccordionDetails>
      </OuterAccordion>
    );
  });
}

export default Accordions;
