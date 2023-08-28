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

/**
 * Apply default styling to the passed summary prop
 * @param props.summary The accordion summary
 * @returns The accordion summary wrapped in default styles if the summary is a string
 */
function FormattedSummary({ summary }: Pick<DetailAccordionProps, 'summary'>) {
  if (typeof summary === 'string') {
    return (
      <Typography variant="body2" component="span" display="inline-block">
        {summary}
      </Typography>
    );
  }
  return summary;
}

function DetailAccordion({ summary, children, summaryProps, detailsProps, ...accordionProps }: DetailAccordionProps) {
  return (
    <Accordion {...accordionProps}>
      <AccordionSummary {...summaryProps}>
        <FormattedSummary summary={summary} />
      </AccordionSummary>
      <AccordionDetails {...detailsProps}>{children}</AccordionDetails>
    </Accordion>
  );
}

export default DetailAccordion;
