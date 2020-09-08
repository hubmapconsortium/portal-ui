import React from 'react';
import { RefinementListFilter, RangeFilter, CheckboxFilter } from 'searchkit';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';

import { InnerAccordion, InnerAccordionSummary, StyledAccordionDetails } from './style';

function Details(props) {
  const { title, children } = props;
  return (
    <InnerAccordion key={title} defaultExpanded>
      <InnerAccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle2">{title}</Typography>
      </InnerAccordionSummary>
      <StyledAccordionDetails>{children}</StyledAccordionDetails>
    </InnerAccordion>
  );
}

function AccordionListFilter(props) {
  const innerProps = {
    containerComponent: Details,
    ...props,
  };
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <RefinementListFilter {...innerProps} />;
}

function AccordionRangeFilter(props) {
  const innerProps = {
    containerComponent: Details,
    ...props,
  };
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <RangeFilter {...innerProps} />;
}

function AccordionCheckboxFilter(props) {
  const innerProps = {
    containerComponent: Details,
    ...props,
  };
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <CheckboxFilter {...innerProps} />;
}

export { AccordionListFilter, AccordionRangeFilter, AccordionCheckboxFilter };
