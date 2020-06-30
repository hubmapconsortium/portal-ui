import styled from 'styled-components';
import TableContainer from '@material-ui/core/TableContainer';
import TableCell from '@material-ui/core/TableCell';

const StyledTableContainer = styled(TableContainer)`
  max-height: ${(props) => props.$maxHeight}px;

  th {
    background-color: #ffffff;
  }
`;

const HeaderCell = styled(TableCell)`
  font-size: ${(props) => props.theme.typography.subtitle2.fontSize};
  font-weight: ${(props) => props.theme.typography.subtitle2.fontWeight};
`;

export { StyledTableContainer, HeaderCell };
