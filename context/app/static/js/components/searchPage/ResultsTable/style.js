import styled from 'styled-components';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';

const StyledTable = styled(Table)`
  background-color: white;
  box-shadow: ${(props) => props.theme.shadows[1]};
`;

const StyledTableBody = styled(TableBody)`
  // NOTE: If we want to darken on hover, we need to give an explicit background to all rows.
  // What looks white is actually transparent and brightness() has no effect.
  background-color: ${(props) => props.theme.palette.white.main};

  :hover {
    filter: ${(props) => props.theme.palette.white.hover};
  }

  // Material would apply this on TD, but we override, so there is no internal border above the highlight.
  border: 1px solid ${(props) => props.theme.palette.divider};

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
    & p {
      color: ${(props) => props.theme.palette.halfShadow.main};
      margin: 0px;
    }
  }
`;

const StyledTableCell = styled(TableCell)`
  // Borders handled by tbody.
  border: none;

  // Elastic search injects <em> when showing matches in context.
  em {
    font-weight: bold;
    font-style: normal;
  }
`;

export { StyledTable, StyledTableRow, StyledTableBody, StyledTableCell };
