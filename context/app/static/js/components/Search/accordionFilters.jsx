import React from 'react';
import { RefinementListFilter, RangeFilter, CheckboxFilter } from 'searchkit';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';

import { InnerAccordion, InnerAccordionSummary, InnerAccordionDetails } from './style';

function Details(props) {
  const { title, children } = props;
  if (Array.isArray(children) && children[0].props.items.length === 0) {
    // Presumably a list filter...
    return null;
  }
  if (
    !Array.isArray(children) &&
    children.props.items.map((bucket) => bucket.doc_count).every((count) => count === 0)
  ) {
    // Presumably a range filter...
    return null;
  }
  return (
    <InnerAccordion key={title} defaultExpanded>
      <InnerAccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle2">{title}</Typography>
      </InnerAccordionSummary>
      <InnerAccordionDetails>{children}</InnerAccordionDetails>
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

AccordionListFilter.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  field: PropTypes.string.isRequired,
  operator: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
};

function AccordionRangeFilter(props) {
  const innerProps = {
    containerComponent: Details,
    ...props,
  };
  // eslint-disable-next-line react/jsx-props-no-spreading
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
    containerComponent: Details,
    ...props,
  };
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <CheckboxFilter {...innerProps} />;
}

AccordionCheckboxFilter.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  filter: PropTypes.object.isRequired,
};

export default { AccordionListFilter, AccordionRangeFilter, AccordionCheckboxFilter };
