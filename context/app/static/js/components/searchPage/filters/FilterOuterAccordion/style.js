import styled from 'styled-components';
import AccordionDetails from '@mui/material/AccordionDetails';

import { StyledAccordion, StyledAccordionSummary } from 'js/components/searchPage/filters/style';

const OuterAccordion = styled(StyledAccordion)`
  border-bottom: 1px solid ${(props) => props.theme.palette.divider};
`;

const OuterAccordionSummary = styled(StyledAccordionSummary)`
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
