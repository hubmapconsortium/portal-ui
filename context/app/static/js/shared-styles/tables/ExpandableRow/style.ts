import { styled } from '@mui/material/styles';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import TableRow, { TableRowProps } from '@mui/material/TableRow';

import ExpandCollapseIcon from 'js/shared-styles/icons/ExpandCollapseIcon';

interface ExpandableComponentProps {
  $isExpanded: boolean;
}

interface ExpandableRowProps extends ExpandableComponentProps, TableRowProps {}

const ExpandedRow = styled(TableRow)<ExpandableRowProps>(({ $isExpanded }: ExpandableComponentProps) => ({
  visibility: $isExpanded ? undefined : 'hidden',
}));

interface ExpandableCellProps extends ExpandableComponentProps, TableCellProps {}

const ExpandedCell = styled(TableCell)<ExpandableCellProps>(({ $isExpanded }: ExpandableCellProps) => ({
  padding: 0,
  borderBottom: $isExpanded ? ' 1px solid rgba(224, 224, 224, 1)' : 'none', // border color taken from MUI table cell
}));

const StyledExpandCollapseIcon = styled(ExpandCollapseIcon)({
  fontSize: '2rem',
});

export { ExpandedRow, ExpandedCell, StyledExpandCollapseIcon };
