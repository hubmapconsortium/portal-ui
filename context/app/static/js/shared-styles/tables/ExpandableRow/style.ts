import { styled } from '@mui/material/styles';
import { shouldForwardProp } from 'js/helpers/styled';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import TableRow, { TableRowProps } from '@mui/material/TableRow';

import ExpandCollapseIcon from 'js/shared-styles/icons/ExpandCollapseIcon';

interface ExpandableComponentProps {
  $isExpanded: boolean;
}

interface ExpandableRowProps extends ExpandableComponentProps, TableRowProps {}

const ExpandedRow = styled(TableRow, { shouldForwardProp })<ExpandableRowProps>(
  ({ $isExpanded }: ExpandableComponentProps) => ({
    visibility: $isExpanded ? undefined : 'hidden',
  }),
);

interface ExpandableCellProps extends ExpandableComponentProps, TableCellProps {}

const ExpandedCell = styled(TableCell, { shouldForwardProp })<ExpandableCellProps>(({ theme, $isExpanded }) => ({
  padding: 0,
  borderBottom: $isExpanded ? `1px solid ${theme.palette.divider}` : 'none', // matches the MUI table cell border
  maxWidth: 0, // This prevents the cell from affecting the width of the table
}));

const StyledExpandCollapseIcon = styled(ExpandCollapseIcon)({
  fontSize: '2rem',
});

export { ExpandedRow, ExpandedCell, StyledExpandCollapseIcon };
