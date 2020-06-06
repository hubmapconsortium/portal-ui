import styled from 'styled-components';
import TableContainer from '@material-ui/core/TableContainer';
import Link from '@material-ui/core/Link';

const StyledTableContainer = styled(TableContainer)`
  max-height: 600px;
`;

const StyledLink = styled(Link)`
  color: ${(props) => props.theme.palette.info.main};
`;

export { StyledTableContainer, StyledLink };
