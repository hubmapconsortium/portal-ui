import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import AccordionSummary from '@material-ui/core/ExpansionPanelSummary';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';

const AccordionText = styled(Typography)`
  color: ${(props) => (props.$isExpanded ? '#fff' : props.theme.palette.text.primary)};
`;

const AccordionSummaryHeading = styled(AccordionText)`
  flex-grow: 1;
  flex-shrink: 0;
`;

const StyledAccordionSummary = styled(AccordionSummary)`
  background-color: ${(props) => (props.$isExpanded ? props.theme.palette.secondary.main : '#E0E0E0')};
`;

const SuccessIcon = styled(CheckCircleRoundedIcon)`
  color: ${(props) => props.theme.palette.success.main};
`;

const Flex = styled.div`
  flex-grow: 4;
  display: flex;
  justify-content: space-between;
`;

export { AccordionSummaryHeading, AccordionText, StyledAccordionSummary, SuccessIcon, Flex };
