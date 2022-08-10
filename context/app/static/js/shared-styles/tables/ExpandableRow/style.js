import styled, { css } from 'styled-components';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import ExpandCollapseIcon from 'js/shared-styles/icons/ExpandCollapseIcon';

const ExpandedRow = styled(TableRow)`
  ${(props) =>
    !props.$isExpanded &&
    css`
      visibility: hidden;
    `};
`;

const ExpandedCell = styled(TableCell)`
  padding: 0;
  border-bottom: ${(props) =>
    props.$isExpanded ? ' 1px solid rgba(224, 224, 224, 1)' : 'none'}; // border color taken from MUI table cell
`;

const StyledExpandCollapseIcon = styled(ExpandCollapseIcon)`
  font-size: 2rem;
`;

export { ExpandedRow, ExpandedCell, StyledExpandCollapseIcon };
