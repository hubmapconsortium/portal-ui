import styled from 'styled-components';
import AccordionDetails from '@mui/material/AccordionDetails';

import { StyledAccordionSummary } from 'js/components/searchPage/filters/style';

const InnerAccordionDetails = styled(AccordionDetails)`
  flex-direction: column;
  padding: 4px 10px 4px 16px;
`;

const InnerAccordionSummary = styled(StyledAccordionSummary)`
  justify-content: left;
  padding: 0px 16px 0px 16px;
  & > * {
    flex-grow: unset;
    padding: 0;
    margin: 0;
    color: #000;
  }
  margin: 0;
`;

export { InnerAccordionDetails, InnerAccordionSummary };
