import React from 'react';
import TableRow from '@mui/material/TableRow';
import Skeleton from '@mui/material/Skeleton';
import { StyledTableCell } from 'js/components/workspaces/Tables/WorkspaceItemsTable/style';

function LoadingRows({ tableWidth }: { tableWidth: number }) {
  return Array.from({ length: 3 }, (i, rowIndex) => (
    <TableRow key={`row-${rowIndex}`}>
      {Array.from({ length: tableWidth + 1 }, (j, cellIndex) => (
        <StyledTableCell key={`cell-${rowIndex}-${cellIndex}`}>
          <Skeleton variant="text" />
        </StyledTableCell>
      ))}
    </TableRow>
  ));
}

export default LoadingRows;
