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
  background-color: #fff;

  :hover {
    filter: brightness(96%);
  }
`;

const internalPaddingPx = 10;
const defaultPaddingPx = 16;
const sidePadding = '4em';

const StyledTableRow = styled(TableRow)`
  &.highlight {
    // "none" or just a 1px border won't override like a 2px border does:
    border-top: 2px solid white;

    & td {
      position: relative;
      padding-top: 0;
      top: ${internalPaddingPx - defaultPaddingPx}px;
      padding-bottom: ${internalPaddingPx}px;

      padding-left: ${sidePadding};
      padding-right: ${sidePadding};
      & a {
        color: rgba(0, 0, 0, 0.54);
      }
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

  :first-child a {
    color: #3781d1;
  }

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
