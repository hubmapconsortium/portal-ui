import React from 'react';

import { useExpandableRowStore } from 'js/shared-styles/tables/ExpandableRow/store';
import { StyledTableCell } from './style';

function ExpandableRowCell({ children }) {
  const { isExpanded } = useExpandableRowStore();

  return <StyledTableCell $removeBorder={isExpanded}>{children}</StyledTableCell>;
}

export default ExpandableRowCell;
