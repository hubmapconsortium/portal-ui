import React from 'react';
import { RefinementListFilter, RangeFilter, CheckboxFilter } from 'searchkit';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';

import { InnerAccordion, InnerAccordionSummary, InnerAccordionDetails, StyledExpandMoreIcon } from './style';

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
      <InnerAccordionSummary expandIcon={<StyledExpandMoreIcon />}>
        <Typography variant="subtitle2" color="textPrimary">
          {title}
        </Typography>
      </InnerAccordionSummary>
      <InnerAccordionDetails id={title.replace(/ /g, '-')}>{children}</InnerAccordionDetails>
    </InnerAccordion>
  );
}

function AccordionListFilter(props) {
  const innerProps = {
    containerComponent: Details,
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
    containerComponent: Details,
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
    containerComponent: Details,
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

export default { AccordionListFilter, AccordionRangeFilter, AccordionCheckboxFilter };
