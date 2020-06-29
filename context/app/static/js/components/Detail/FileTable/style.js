import styled from 'styled-components';
import TableContainer from '@material-ui/core/TableContainer';
import TableCell from '@material-ui/core/TableCell';
import Link from '@material-ui/core/Link';

const StyledTableContainer = styled(TableContainer)`
  max-height: 600px;

  th {
    background-color: #ffffff;
  }
`;

const HeaderCell = styled(TableCell)`
  font-size: ${(props) => props.theme.typography.subtitle2.fontSize};
  font-weight: ${(props) => props.theme.typography.subtitle2.fontWeight};
`;

const StyledLink = styled(Link)`
  color: ${(props) => props.theme.palette.info.main};
`;

export { StyledTableContainer, StyledLink, HeaderCell };
