import { styled } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: 340,
  overflowY: 'auto',
  '& .MuiTableCell-root': {
    backgroundColor: theme.palette.white,
  },
}));

const HeaderCell = styled(TableCell)(({ theme }) => ({
  fontSize: theme.typography.subtitle2.fontSize,
  fontWeight: theme.typography.subtitle2.fontWeight,
}));

export { StyledTableContainer, HeaderCell };
