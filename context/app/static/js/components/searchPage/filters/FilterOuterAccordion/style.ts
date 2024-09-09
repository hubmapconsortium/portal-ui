import { styled } from '@mui/material/styles';
import AccordionDetails from '@mui/material/AccordionDetails';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';

const OuterAccordion = styled(Accordion)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const OuterAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  '& > *': {
    padding: 0,
    margin: 0,
  },
  marginTop: `${theme.spacing(1)} !important`,
  marginBottom: `${theme.spacing(1)} !important`,
  padding: `${theme.spacing(0, 1.5, 0, 1.5)}`,
}));

const OuterAccordionDetails = styled(AccordionDetails)({
  flexDirection: 'column',
  padding: 0,
});

export { OuterAccordion, OuterAccordionSummary, OuterAccordionDetails };
