import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';

// In the latest version, "ExpansionPanel" is renamed to "Accordion".
import AccordionDetails from '@material-ui/core/ExpansionPanelDetails';
import AccordionSummary from '@material-ui/core/ExpansionPanelSummary';
import Accordion from '@material-ui/core/ExpansionPanel';

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
  border-bottom: 1px solid ${(props) => props.theme.palette.collectionsDivider.main};
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
  margin-top: 12px !important;
  margin-bottom: 12px !important;
`;

const InnerAccordionSummary = styled(StyledAccordionSummary)`
  justify-content: left;
  & > * {
    flex-grow: unset;
    padding: 0;
    margin: 0;
    color: #000;
  }
  margin: 0;
`;

const StyledAccordionDetails = styled(AccordionDetails)`
  flex-direction: column;
  padding-bottom: 0;
`;

const StyledSideBar = styled(SideBar)`
  padding: 0;
`;

export {
  StyledAccordionDetails,
  OuterAccordionSummary,
  InnerAccordionSummary,
  StyledSideBar,
  InnerAccordion,
  OuterAccordion,
};
