import styled from 'styled-components';
import AccordionDetails from '@mui/material/AccordionDetails';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';

const OuterAccordion = styled(Accordion)`
  border-bottom: 1px solid ${(props) => props.theme.palette.divider};
`;

const OuterAccordionSummary = styled(AccordionSummary)`
  & > * {
    padding: 0;
    margin: 0;
  }
  margin-top: 8px !important;
  margin-bottom: 8px !important;
  padding: 0px 12px 0px 12px;
`;

const OuterAccordionDetails = styled(AccordionDetails)`
  flex-direction: column;
  padding: 0;
`;

export { OuterAccordion, OuterAccordionSummary, OuterAccordionDetails };
