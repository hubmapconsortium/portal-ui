/* eslint-disable no-shadow */
import * as React from 'react';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { LinearProgress } from '@mui/material';

import { StyledTableContainer, HeaderCell } from 'js/shared-styles/tables';
import SelectableHeaderCell from 'js/shared-styles/tables/SelectableHeaderCell';
import SelectableRowCell from 'js/shared-styles/tables/SelectableRowCell';
import { OrderIcon } from 'js/components/searchPage/SortingTableHead/SortingTableHead';
import useScrollTable from 'js/hooks/useScrollTable';
import { SortState } from 'js/hooks/useSortState';
import { Column } from './EntitiesTable/types';

function TablePaddingRow({ padding }: { padding: number }) {
  if (padding === 0) {
    return null;
  }
  return (
    <tr>
      <td style={{ height: `${padding}px` }} aria-hidden="true" />
    </tr>
  );
}

interface TableProps extends React.PropsWithChildren {
  onScroll: (event: React.UIEvent<HTMLDivElement, UIEvent>) => void;
  tablePadding: { top: number; bottom: number };
  renderHeader: () => React.ReactNode;

  isLoading?: boolean;
}

interface NonSelectableTableProps {
  isSelectable: false;
  allSearchIDs: undefined;
}

interface SelectableTableProps {
  isSelectable: true;
  allSearchIDs: string[];
}

type SelectionProps = NonSelectableTableProps | SelectableTableProps;

const TABLE_HEADER_HEIGHT = 60;

function TableProgress({ isLoading, colSpan }: { isLoading?: boolean; colSpan: number }) {
  return (
    <TableRow aria-hidden="true">
      <TableCell colSpan={colSpan} sx={{ top: TABLE_HEADER_HEIGHT, border: 'none' }} padding="none" component="td">
        <LinearProgress
          sx={{
            width: '100%',
            opacity: isLoading ? 1 : 0,
            transition: 'opacity',
          }}
          variant="indeterminate"
        />
      </TableCell>
    </TableRow>
  );
}

const TableComponent = React.forwardRef(function HeadlessTable<Doc>(
  { onScroll, isSelectable, allSearchIDs, columns, tablePadding, isLoading }: TableProps & SelectionProps,
  ref: React.Ref<HTMLDivElement>,
) {
  return (
    <StyledTableContainer component={Paper} ref={ref} onScroll={onScroll}>
      <Table stickyHeader>
        <TableHead sx={{ position: 'relative' }}>
          <TableRow sx={{ height: TABLE_HEADER_HEIGHT }}>
            {isSelectable && (
              <SelectableHeaderCell
                allTableRowKeys={allSearchIDs}
                disabled={false}
                sx={({ palette }) => ({ backgroundColor: palette.background.paper })}
              />
            )}
            {columns.map((column) => (
              <EntityHeaderCell column={column} setSort={setSort} sortState={sortState} key={column.id} />
            ))}
          </TableRow>
          <TableProgress colSpan={columns.length + (isSelectable ? 1 : 0)} isLoading={isLoading} />
        </TableHead>
        <TableBody>
          <TablePaddingRow padding={tablePadding.top} />
          {virtualRows.map((virtualRow) => {
            const hit = searchHits[virtualRow.index];
            if (hit) {
              return (
                <TableRow sx={{ height: virtualRow.size }} key={hit?._id}>
                  {isSelectable && <SelectableRowCell rowKey={hit?._id} />}
                  {columns.map(({ cellContent: CellContent, id }) => (
                    <TableCell key={id}>
                      <CellContent hit={hit._source} />
                    </TableCell>
                  ))}
                </TableRow>
              );
            }
            return null;
          })}
          <TablePaddingRow padding={tablePadding.bottom} />
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
});

export default TableComponent;
