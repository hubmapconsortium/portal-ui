import { styled } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';

const ChipWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  position: 'sticky',
  top: 0,
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.white.main,
  zIndex: theme.zIndex.fileBrowserHeader,
  display: 'flex',
  gap: theme.spacing(1),
}));

const StyledTableContainer = styled(TableContainer)({
  maxHeight: 600,
  overflowY: 'auto',
});

export { ChipWrapper, StyledTableContainer };
