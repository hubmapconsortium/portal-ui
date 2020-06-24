import styled from 'styled-components';
import TableContainer from '@material-ui/core/TableContainer';
import GetAppIcon from '@material-ui/icons/GetApp';

const StyledTableContainer = styled(TableContainer)`
  max-height: 364px;
`;

const DownloadIcon = styled(GetAppIcon)`
  font-size: 25px;
`;

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
`;

export { StyledTableContainer, DownloadIcon, Flex };
