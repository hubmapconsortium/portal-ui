import styled from 'styled-components';
import TableContainer from '@material-ui/core/TableContainer';
import TableCell from '@material-ui/core/TableCell';

import GetAppIcon from '@material-ui/icons/GetApp';

const StyledTableContainer = styled(TableContainer)`
  max-height: 364px;

  th {
    background-color: #ffffff;
  }
`;

const DownloadIcon = styled(GetAppIcon)`
  font-size: 25px;
`;

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
`;

const HeaderCell = styled(TableCell)`
  font-size: ${(props) => props.theme.typography.subtitle2.fontSize};
  font-weight: ${(props) => props.theme.typography.subtitle2.fontWeight};
`;

export { StyledTableContainer, DownloadIcon, Flex, HeaderCell };
