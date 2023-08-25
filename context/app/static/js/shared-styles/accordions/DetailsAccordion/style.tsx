import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ExpandMore from '@mui/icons-material/ExpandMore';

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
  () => ({
    backgroundColor: 'transparent',
    padding: 0,
    border: 0,
    '&:before': {
      display: 'none',
    },
  }),
);

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary expandIcon={<ExpandMore color="primary" />} {...props} />
))(() => ({
  backgroundColor: 'transparent',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: 1,
  px: 0,
  pb: 0,
  minHeight: 'auto',
  '&.MuiButtonBase-root': {
    padding: 0,
  },
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(180deg)',
  },
  '& .MuiAccordionSummary-content': {
    flexGrow: 0,
    margin: 0,
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(() => ({
  padding: 0,
}));

export { Accordion, AccordionSummary, AccordionDetails };
