import React from 'react';

import { useExpandableRowStore } from 'js/shared-styles/tables/ExpandableRow/store';
import { TableCellProps } from '@mui/material';
import { StyledTableCell } from './style';

function ExpandableRowCell({ children, ...props }: TableCellProps) {
  const { isExpanded } = useExpandableRowStore();

  return (
    <StyledTableCell $removeBorder={isExpanded} {...props}>
      {children}
    </StyledTableCell>
  );
}

export default ExpandableRowCell;
