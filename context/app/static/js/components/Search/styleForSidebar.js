import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';

// In the latest version, "ExpansionPanel" is renamed to "Accordion".
import AccordionDetails from '@material-ui/core/ExpansionPanelDetails';
import AccordionSummary from '@material-ui/core/ExpansionPanelSummary';
import Accordion from '@material-ui/core/ExpansionPanel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { SideBar } from 'searchkit';

const InnerAccordion = styled(Accordion)`
  box-shadow: none;
  border: none;
  margin: 0 !important; // Override margin on expand.
  ::before {
    // Material UI adds a "border" using the pseudoelement.
    content: none;
  }
`;

const OuterAccordion = styled(InnerAccordion)`
  border-bottom: 1px solid ${(props) => props.theme.palette.divider};
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

const OuterAccordionSummary = styled(StyledAccordionSummary)`
  & > * {
    padding: 0;
    margin: 0;
  }
  margin-top: 8px !important;
  margin-bottom: 8px !important;
  padding: 0px 12px 0px 12px;
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

const OuterAccordionDetails = styled(AccordionDetails)`
  flex-direction: column;
  padding: 0;
`;

const InnerAccordionDetails = styled(AccordionDetails)`
  flex-direction: column;
  padding: 4px 10px 4px 16px;
`;

const StyledSideBar = styled(SideBar)`
  padding: 0;
`;

const StyledExpandMoreIcon = styled(ExpandMoreIcon)`
  font-size: 1rem;
  color: ${(props) => props.theme.palette.secondary.main};
`;

export {
  OuterAccordionDetails,
  InnerAccordionDetails,
  OuterAccordionSummary,
  InnerAccordionSummary,
  StyledSideBar,
  InnerAccordion,
  OuterAccordion,
  StyledExpandMoreIcon,
};
