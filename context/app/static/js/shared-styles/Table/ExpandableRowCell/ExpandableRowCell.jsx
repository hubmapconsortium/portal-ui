import React from 'react';

import { useStore } from 'js/shared-styles/Table/ExpandableRow/store';
import { StyledTableCell } from './style';

function ExpandableRowCell({ children }) {
  const { isExpanded } = useStore();

  return <StyledTableCell $removeBorder={isExpanded}>{children}</StyledTableCell>;
}

export default ExpandableRowCell;
