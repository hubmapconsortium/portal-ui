import styled from 'styled-components';
import ArrowUpward from '@material-ui/icons/ArrowUpwardRounded';
import ArrowDownward from '@material-ui/icons/ArrowDownwardRounded';
import TableRow from '@material-ui/core/TableRow';

import { HeaderCell } from 'shared-styles/Table';

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

const StyledTableRow = styled(TableRow)`
  // NOTE: If we want to darken on hover, we need to give an explicit background to all rows.
  // What looks white is actually transparent and brightness() has no effect.
  background-color: #fff;

  :hover {
    filter: brightness(96%);
  }
`;

export { ArrowUpOn, ArrowDownOn, ArrowUpOff, ArrowDownOff, StyledHeaderCell, StyledTableRow };
