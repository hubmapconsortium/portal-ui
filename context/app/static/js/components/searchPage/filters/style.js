import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';

// In the latest version, "Accordion" is renamed to "Accordion".
import AccordionSummary from '@mui/material/AccordionSummary';
import Accordion from '@mui/material/Accordion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const StyledAccordion = styled(Accordion)`
  box-shadow: none;
  border: none;
  margin: 0 !important; // Override margin on expand.
  ::before {
    // Material UI adds a "border" using the pseudoelement.
    content: none;
  }
`;

const StyledAccordionSummary = withStyles({
  // Material UI default is to increase spacing when expanded.
  root: {
    minHeight: 'auto !important',
    margin: '0 !important',
  },
  expanded: {
    minHeight: 'auto !important',
    margin: '0 !important',
  },
})(AccordionSummary);

const StyledExpandMoreIcon = styled(ExpandMoreIcon)`
  font-size: 1rem;
  color: ${(props) => props.theme.palette.secondary.main};
`;

export { StyledExpandMoreIcon, StyledAccordion, StyledAccordionSummary };
