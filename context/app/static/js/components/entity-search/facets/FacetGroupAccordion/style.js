import styled from 'styled-components';
import AccordionDetails from '@mui/material/AccordionDetails';

import StyledAccordion from '@mui/material/Accordion';
import StyledAccordionSummary from '@mui/material/AccordionSummary';

const OuterAccordion = styled(StyledAccordion)`
  border-bottom: 1px solid ${(props) => props.theme.palette.divider};
`;

const OuterAccordionSummary = styled(StyledAccordionSummary)`
  & > * {
    padding: 0;
    margin: 0;
  }
  margin: ${(props) => `${props.theme.spacing(1)} 0px`} !important; // important is necesary because MUI uses it.
  padding: ${(props) => `0px ${props.theme.spacing(1.5)}`};
`;

const OuterAccordionDetails = styled(AccordionDetails)`
  flex-direction: column;
  padding: 0;
`;

export { OuterAccordion, OuterAccordionSummary, OuterAccordionDetails };
