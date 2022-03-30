import styled from 'styled-components';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';

const StyledTable = styled(Table)`
  background-color: white;
  box-shadow: ${(props) => props.theme.shadows[1]};
`;

const StyledTableRow = styled(TableRow)`
  // NOTE: If we want to darken on hover, we need to give an explicit background to all rows.
  // What looks white is actually transparent and brightness() has no effect.
  background-color: ${(props) => props.theme.palette.white.main};
  :hover {
    filter: ${(props) => props.theme.palette.white.hover};
  }
`;

export { StyledTable, StyledTableRow };
