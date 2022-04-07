import styled from 'styled-components';
import AccordionDetails from '@material-ui/core/ExpansionPanelDetails';

import { StyledAccordionSummary } from 'js/components/searchPage/filters/style';

const InnerAccordionDetails = styled(AccordionDetails)`
  flex-direction: column;
  padding: 4px 10px 4px 16px;
`;

const InnerAccordionSummary = styled(StyledAccordionSummary)`
  justify-content: left;
  padding: ${(props) => `0px ${props.theme.spacing(2)}px`};
  & > * {
    flex-grow: unset;
    padding: 0;
    margin: 0;
  }
  margin: 0;
`;

export { InnerAccordionDetails, InnerAccordionSummary };
