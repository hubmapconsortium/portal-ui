import styled from 'styled-components';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';

const InnerAccordionDetails = styled(AccordionDetails)`
  flex-direction: column;
  padding: 4px 10px 4px 16px;
`;

const InnerAccordionSummary = styled(AccordionSummary)`
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
