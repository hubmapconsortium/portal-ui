import React from 'react';
import Typography from '@mui/material/Typography';

import { StyledAccordion, StyledExpandMoreIcon } from 'js/components/searchPage/filters/style';
import { InnerAccordionDetails, InnerAccordionSummary } from './style';

function InnerAccordionContainer({ title, children }) {
  if (Array.isArray(children) && children[0].props.items.length === 0) {
    // Presumably a list filter...
    return null;
  }
  if (
    !Array.isArray(children) &&
    children.props.items?.map((bucket) => bucket.doc_count).every((count) => count === 0)
  ) {
    // Presumably a range filter...
    return null;
  }
  return (
    <StyledAccordion key={title} defaultExpanded>
      <InnerAccordionSummary expandIcon={<StyledExpandMoreIcon />}>
        <Typography variant="subtitle2" color="textPrimary">
          {title}
        </Typography>
      </InnerAccordionSummary>
      <InnerAccordionDetails id={title.replace(/\s/g, '-')}>{children}</InnerAccordionDetails>
    </StyledAccordion>
  );
}

export default InnerAccordionContainer;
