import styled from 'styled-components';
import TableCell from '@mui/material/TableCell';

const StyledTableCell = styled(TableCell)`
  ${(props) => props.$removeBorder && `border-bottom: none`};
`;

export { StyledTableCell };
