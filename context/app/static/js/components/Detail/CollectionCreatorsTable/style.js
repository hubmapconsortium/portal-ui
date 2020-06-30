import styled from 'styled-components';
import TableContainer from '@material-ui/core/TableContainer';
import TableCell from '@material-ui/core/TableCell';
import Link from '@material-ui/core/Link';
import InfoIcon from '@material-ui/icons/Info';

const StyledTableContainer = styled(TableContainer)`
  max-height: 312px;

  th {
    background-color: #ffffff;
  }
`;

const HeaderCell = styled(TableCell)`
  font-size: ${(props) => props.theme.typography.subtitle2.fontSize};
  font-weight: ${(props) => props.theme.typography.subtitle2.fontWeight};
`;

const HeaderIconCell = styled(TableCell)`
  font-size: ${(props) => props.theme.typography.subtitle2.fontSize};
  font-weight: ${(props) => props.theme.typography.subtitle2.fontWeight};
  display: flex;
  align-items: center;
`;

const StyledLink = styled(Link)`
  color: ${(props) => props.theme.palette.info.main};
`;

const StyledInfoIcon = styled(InfoIcon)`
  margin-left: ${(props) => props.theme.spacing(0.5)}px;
  font-size: 1rem;
`;

export { StyledTableContainer, HeaderCell, HeaderIconCell, StyledLink, StyledInfoIcon };
