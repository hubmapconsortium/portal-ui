import { styled } from '@mui/material/styles';
import TableContainer, { TableContainerProps } from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';
import { ComponentType } from 'react';

interface StyledTableContainerProps extends TableContainerProps {
  maxHeight?: number;
}

const StyledTableContainer = styled(TableContainer)<StyledTableContainerProps>(({ theme, maxHeight = 340 }) => ({
  maxHeight,
  overflowY: 'auto',
  '& .MuiTableCell-root': {
    backgroundColor: theme.palette.white,
  },
})) as typeof TableContainer & ComponentType<StyledTableContainerProps>;

const HeaderCell = TableCell;

export { StyledTableContainer, HeaderCell };
