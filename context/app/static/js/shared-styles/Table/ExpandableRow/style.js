import styled from 'styled-components';
import TableCell from '@material-ui/core/TableCell';

const StyledTableCell = styled(TableCell)`
  padding: ${(props) => (props.$isExpanded ? `${props.theme.spacing(2)}px` : 0)};
  border-bottom: ${(props) => (props.$isExpanded ? ' 1px solid rgba(224, 224, 224, 1)' : 'none')};
`;

export { StyledTableCell };
