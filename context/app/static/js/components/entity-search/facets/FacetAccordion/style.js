import styled from 'styled-components';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';

import { StyledAccordionSummary } from 'js/components/searchPage/filters/style';

const InnerAccordionDetails = styled(AccordionDetails)`
  flex-direction: column;
  padding: 4px 10px 4px 16px;
`;

const InnerAccordionSummary = styled(StyledAccordionSummary)`
  justify-content: left;
  padding: ${(props) => `0px ${props.theme.spacing(2)}`};
  & > * {
    flex-grow: unset;
    padding: 0;
    margin: 0;
  }
  margin: 0;
`;

const StyledTypography = styled(Typography)`
  word-break: break-word;
`;

export { InnerAccordionDetails, InnerAccordionSummary, StyledTypography };
