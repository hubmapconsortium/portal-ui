import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import ArrowUpward from '@material-ui/icons/ArrowUpwardRounded';
import ArrowDownward from '@material-ui/icons/ArrowDownwardRounded';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';

// In the latest version, "ExpansionPanel" is renamed to "Accordion".
import AccordionDetails from '@material-ui/core/ExpansionPanelDetails';
import AccordionSummary from '@material-ui/core/ExpansionPanelSummary';
import Accordion from '@material-ui/core/ExpansionPanel';

import { SideBar } from 'searchkit';

import { HeaderCell } from 'js/shared-styles/Table';

const ArrowUpOn = styled(ArrowUpward)`
  vertical-align: middle;
`;

const ArrowDownOn = styled(ArrowDownward)`
  vertical-align: middle;
`;

const ArrowUpOff = styled(ArrowUpward)`
  vertical-align: middle;
  opacity: 12%;
`;

const ArrowDownOff = styled(ArrowDownward)`
  vertical-align: middle;
  opacity: 12%;
`;

const StyledHeaderCell = styled(HeaderCell)`
  cursor: pointer;
  white-space: nowrap;
`;

const StyledTableBody = styled(TableBody)`
  // NOTE: If we want to darken on hover, we need to give an explicit background to all rows.
  // What looks white is actually transparent and brightness() has no effect.
  background-color: ${(props) => props.theme.palette.white.main};

  :hover {
    filter: ${(props) => props.theme.palette.white.hover};
  }

  // Material would apply this on TD, but we override, so there is no internal border above the highlight.
  border: 1px solid rgba(224, 224, 224, 1);

  border-left: none;
  border-right: none;
`;

const interPadding = `${16 * 0.6}px`;
const sidePadding = '64px';

const StyledTableRow = styled(TableRow)`
  border: 0;

  &.before-highlight td {
    padding-bottom: 0px;
  }

  &.highlight td {
    padding-top: ${interPadding};
    padding-left: ${sidePadding};
    padding-right: ${sidePadding};
    & a {
      color: rgba(0, 0, 0, 0.54);
    }
  }
`;

const StyledTableCell = styled(TableCell)`
  // Force <a> to fill each cell, so the whole row is clickable.
  // https://stackoverflow.com/questions/3966027
  overflow: hidden;

  a {
    display: block;
    margin: -100%;
    padding: 100%;
    color: rgb(0, 0, 0);
    overflow-wrap: break-word;
  }

  // So just one entry in the row looks like a link.
  :first-child a {
    color: ${(props) => props.theme.palette.link.main};
  }

  // Borders handled by tbody.
  border: none;

  // Elastic search injects <em> when showing matches in context.
  em {
    font-weight: bold;
    font-style: normal;
  }
`;

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
  border-bottom: 1px solid ${(props) => props.theme.palette.transparentGray.main};
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

const StyledAccordionDetails = styled(AccordionDetails)`
  flex-direction: column;
`;

const StyledSideBar = styled(SideBar)`
  padding: 0;
`;

export {
  ArrowUpOn,
  ArrowDownOn,
  ArrowUpOff,
  ArrowDownOff,
  StyledHeaderCell,
  StyledTableRow,
  StyledTableBody,
  StyledTableCell,
  StyledAccordionDetails,
  StyledAccordionSummary,
  StyledSideBar,
  InnerAccordion,
  OuterAccordion,
};
