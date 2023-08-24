import * as React from 'react';
import { AccordionProps } from '@mui/material/Accordion';
import { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import { AccordionDetailsProps } from '@mui/material/AccordionDetails';
import { Typography } from '@mui/material';
import { Accordion, AccordionDetails, AccordionSummary } from './style';

type DetailAccordionProps = React.PropsWithChildren<{
  summary: React.ReactNode;
  summaryProps?: AccordionSummaryProps;
  detailsProps?: AccordionDetailsProps;
}> &
  AccordionProps;

function DetailAccordion({ summary, children, summaryProps, detailsProps, ...accordionProps }: DetailAccordionProps) {
  // wrap summary in Typography if it's a string to apply basic styling
  const wrappedSummary =
    typeof summary === 'string' ? (
      <Typography variant="body2" component="span" display="inline-block">
        {summary}
      </Typography>
    ) : (
      summary
    );
  return (
    <Accordion {...accordionProps}>
      <AccordionSummary {...summaryProps}>{wrappedSummary}</AccordionSummary>
      <AccordionDetails {...detailsProps}>{children}</AccordionDetails>
    </Accordion>
  );
}

export default DetailAccordion;
