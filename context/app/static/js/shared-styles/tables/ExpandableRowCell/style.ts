import { styled } from '@mui/material/styles';
import TableCell, { TableCellProps } from '@mui/material/TableCell';

interface StyledTableCellProps extends TableCellProps {
  $removeBorder: boolean;
}

const StyledTableCell = styled(TableCell)<StyledTableCellProps>(({ $removeBorder }) => ({
  borderBottom: $removeBorder ? 'none' : undefined,
}));

export { StyledTableCell };
