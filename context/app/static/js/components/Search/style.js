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

const StyledTableRow = styled(TableRow)`
  &.highlight {
    // 1px border not effective.
    border-top: 2px solid white;

    // Dotted border comes out irregular; different on different browsers.
    // border-top: 2px dotted rgb(224, 224, 224);

    & td {
      padding-left: 4em;
      padding-right: 4em;
      padding-top: 0;
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
