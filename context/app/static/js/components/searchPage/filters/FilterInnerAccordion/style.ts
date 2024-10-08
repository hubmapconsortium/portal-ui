import { styled } from '@mui/material/styles';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

const InnerAccordionDetails = styled(AccordionDetails)({
  flexDirection: 'column',
  padding: '4px 10px 4px 16px',
});

const InnerAccordionSummary = styled(AccordionSummary)({
  justifyContent: 'left',
  padding: '0px 16px 0px 16px',
  '& > *': {
    flexGrow: 'unset',
    padding: 0,
    margin: 0,
    color: '#000',
  },
  margin: 0,
});

export { InnerAccordionDetails, InnerAccordionSummary };
