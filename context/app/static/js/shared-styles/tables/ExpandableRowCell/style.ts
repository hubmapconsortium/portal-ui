import { styled } from '@mui/material/styles';
import { shouldForwardProp } from 'js/helpers/styled';
import TableCell, { TableCellProps } from '@mui/material/TableCell';

interface StyledTableCellProps extends TableCellProps {
  $removeBorder: boolean;
}

const StyledTableCell = styled(TableCell, { shouldForwardProp })<StyledTableCellProps>(({ $removeBorder }) => ({
  borderBottom: $removeBorder ? 'none' : undefined,
}));

export { StyledTableCell };
