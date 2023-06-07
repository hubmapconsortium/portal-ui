import styled from 'styled-components';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';

const ChipWrapper = styled.div`
  border-bottom: 1px solid ${(props) => props.theme.palette.divider};
  padding: 12px 15px;
  position: sticky;
  top: 0;
  background-color: ${(props) => props.theme.palette.white.main};
  z-index: ${(props) => props.theme.zIndex.fileBrowserHeader};
`;

const StyledTableContainer = styled(TableContainer)`
  max-height: 600px;
  overflow-y: auto;
`;

const HiddenTableHead = styled(TableHead)`
  display: none;
`;

export { ChipWrapper, StyledTableContainer, HiddenTableHead };
