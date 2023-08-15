import { styled } from '@mui/styles';
import TableContainer from '@mui/material/TableContainer';

const ChipWrapper = styled('div')(({ theme }) => ({
  padding: '12px 15px',
  position: 'sticky',
  top: 0,
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.white.main,
  zIndex: theme.zIndex.fileBrowserHeader,
  display: 'flex',
  gap: theme.spacing(1),
}));

const StyledTableContainer = styled(TableContainer)`
  max-height: 600px;
  overflow-y: auto;
`;

export { ChipWrapper, StyledTableContainer };
