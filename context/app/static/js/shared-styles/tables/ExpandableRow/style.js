import styled, { css } from 'styled-components';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import ExpandCollapseIconButton from 'js/shared-styles/buttons/ExpandCollapseIconButton';

const ClickableRow = styled(TableRow)`
  cursor: pointer;
  background-color: ${(props) => props.theme.palette.white.main};
  &:hover {
    filter: ${(props) => props.theme.palette.white.hover};
  }
`;

const ExpandedRow = styled(TableRow)`
  ${(props) =>
    !props.$isExpanded &&
    css`
      visibility: hidden;
    `};
`;

const ExpandedCell = styled(TableCell)`
  padding: ${(props) => (props.$isExpanded ? `${props.theme.spacing(2)}px` : 0)};
  border-bottom: ${(props) =>
    props.$isExpanded ? ' 1px solid rgba(224, 224, 224, 1)' : 'none'}; // border color taken from MUI table cell
`;

const StyledExpandCollapseIconButton = styled(ExpandCollapseIconButton)`
  span > svg {
    font-size: 2rem;
  }
`;

export { ClickableRow, ExpandedRow, ExpandedCell, StyledExpandCollapseIconButton };
