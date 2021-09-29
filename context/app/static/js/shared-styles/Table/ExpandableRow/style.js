import styled, { css } from 'styled-components';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

const ExpandedRow = styled(TableRow)`
  ${(props) =>
    !props.$isExpanded &&
    css`
      visibility: hidden;
    `};
`;

const ExpandedCell = styled(TableCell)`
  padding: ${(props) => (props.$isExpanded ? `${props.theme.spacing(2)}px` : 0)};
  border-bottom: ${(props) => (props.$isExpanded ? ' 1px solid rgba(224, 224, 224, 1)' : 'none')};
`;

export { ExpandedRow, ExpandedCell };
