import styled from 'styled-components';
import ArrowUpward from '@material-ui/icons/ArrowUpwardRounded';
import ArrowDownward from '@material-ui/icons/ArrowDownwardRounded';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';

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
  border: 1px solid ${(props) => props.theme.palette.collectionsDivider.main};

  border-left: none;
  border-right: none;
`;

const interPadding = `${16 * 0.6}px`;
const sidePadding = '64px';

const StyledTableRow = styled(TableRow)`
  border: 0;

  // So just one entry in the row looks like a link.
  td:first-child {
    color: ${(props) => props.theme.palette.link.main};
  }

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
  // Borders handled by tbody.
  border: none;

  // Elastic search injects <em> when showing matches in context.
  em {
    font-weight: bold;
    font-style: normal;
  }
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
};
