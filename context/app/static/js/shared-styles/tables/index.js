import styled from 'styled-components';
import TableContainer from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';

const StyledTableContainer = styled(TableContainer)`
  max-height: 340px; // Height lands in the middle of a row, to show that div can scroll.

  th {
    background-color: #ffffff;
  }
`;

const HeaderCell = styled(TableCell)`
  font-size: ${(props) => props.theme.typography.subtitle2.fontSize};
  font-weight: ${(props) => props.theme.typography.subtitle2.fontWeight};
`;

export { StyledTableContainer, HeaderCell };
