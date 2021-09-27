import styled from 'styled-components';
import TableCell from '@material-ui/core/TableCell';

const StyledTableCell = styled(TableCell)`
  ${(props) => props.$removeBorder && `border-bottom: none`};
`;

export { StyledTableCell };
