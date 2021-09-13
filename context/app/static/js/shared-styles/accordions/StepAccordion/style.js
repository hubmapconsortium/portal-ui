import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import AccordionSummary from '@material-ui/core/ExpansionPanelSummary';

const AccordionText = styled(Typography)`
  color: ${(props) => (props.$isExpanded ? '#fff' : props.theme.palette.text.primary)};
`;

const AccordionSummaryHeading = styled(AccordionText)`
  flex-grow: 1;
  flex-shrink: 0;
`;

const AccordionSummaryText = styled(AccordionText)`
  flex-grow: 3;
`;

const StyledAccordionSummary = styled(AccordionSummary)`
  background-color: ${(props) => (props.$isExpanded ? props.theme.palette.secondary.main : '#E0E0E0')};
`;

export { AccordionSummaryHeading, AccordionSummaryText, StyledAccordionSummary };
