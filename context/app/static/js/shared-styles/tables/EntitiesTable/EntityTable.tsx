import React from 'react';

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
import { WorkspacesEventInfo } from 'js/components/workspaces/types';
import { Entity } from 'js/components/types';
import { Column, EntitiesTabTypes } from './types';
import ExpandableRow from '../ExpandableRow';
import ExpandableRowCell from '../ExpandableRowCell';

interface EntityHeaderCellTypes<Doc> {
  column: Column<Doc>;
  setSort: (columnId: string) => void;
  sortState: SortState;
}

function EntityHeaderCell<Doc>({ column, setSort, sortState }: EntityHeaderCellTypes<Doc>) {
  // This is a workaround to ensure the header cell control is accessible with consistent keyboard navigation
  // and appearance. The header cell contains a disabled, hidden button that is the full width of the cell. This
  // allows us to set the header cell to position: relative and create another button that is absolutely positioned
  // within the cell. The absolute button is the one that is visible and clickable, and takes up the full width of
  // the cell, which is guaranteed to be wide enough to contain the column label.
  return (
    <HeaderCell key={column.id} sx={({ palette }) => ({ backgroundColor: palette.background.paper })}>
      <Button sx={{ visibility: 'hidden', whiteSpace: 'nowrap', py: 0 }} fullWidth disabled>
        {column.label}
      </Button>
      <Button
        variant="text"
        onClick={() => {
          setSort(column.id);
        }}
        disableTouchRipple
        sx={{
          justifyContent: 'flex-start',
          whiteSpace: 'nowrap',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pl: 2,
        }}
        endIcon={<OrderIcon order={sortState.columnId === column.id ? sortState.direction : undefined} />}
      >
        {column.label}
      </Button>
    </HeaderCell>
  );
}

function TablePaddingRow({ padding }: { padding: number }) {
  return (
    <tr>
      <td style={{ height: `${padding}px` }} aria-hidden="true" />
    </tr>
  );
}

interface EntityTableProps<Doc extends Entity>
  extends Pick<EntitiesTabTypes<Doc>, 'query' | 'columns' | 'expandedContent'> {
  isSelectable: boolean;
  disabledIDs?: Set<string>;
  trackingInfo?: WorkspacesEventInfo;
  disabledTooltipTitle?: string;
  maxHeight?: number;
}

const headerRowHeight = 60;

function EntityTable<Doc extends Entity>({
  query,
  columns,
  disabledIDs,
  isSelectable = true,
  trackingInfo,
  expandedContent: ExpandedContent,
  disabledTooltipTitle,
  maxHeight,
}: EntityTableProps<Doc>) {
  const columnNameMapping = columns.reduce((acc, column) => ({ ...acc, [column.id]: column.sort }), {});
  const isExpandable = Boolean(ExpandedContent);

  const TableRowComponent = isExpandable ? ExpandableRow : TableRow;
  const TableCellComponent = isExpandable ? ExpandableRowCell : TableCell;

  const {
    searchHits,
    allSearchIDs,
    isLoading,
    sortState,
    setSort,
    fetchMoreOnBottomReached,
    virtualRows,
    tableBodyPadding,
    tableContainerRef,
  } = useScrollTable<Doc>({
    query,
    columnNameMapping,
    initialSortState: { columnId: 'last_modified_timestamp', direction: 'desc' },
  });

  return (
    <StyledTableContainer
      component={Paper}
      ref={tableContainerRef}
      onScroll={(event) => fetchMoreOnBottomReached(event)}
      maxHeight={maxHeight}
    >
      <Table stickyHeader>
        <TableHead sx={{ position: 'relative' }}>
          <TableRow sx={{ height: headerRowHeight }}>
            {isSelectable && (
              <SelectableHeaderCell
                allTableRowKeys={allSearchIDs}
                disabledTableRowKeys={disabledIDs}
                disabled={false}
                sx={({ palette }) => ({ backgroundColor: palette.background.paper })}
              />
            )}
            {columns.map((column) => (
              <EntityHeaderCell column={column} setSort={setSort} sortState={sortState} key={column.id} />
            ))}
            {isExpandable && <TableCell />}
          </TableRow>
          <TableRow aria-hidden="true">
            <TableCell
              colSpan={columns.length + (isSelectable ? 1 : 0)}
              sx={{ top: headerRowHeight, border: 'none' }}
              padding="none"
              component="td"
            >
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
        </TableHead>
        <TableBody>
          {tableBodyPadding.top > 0 && <TablePaddingRow padding={tableBodyPadding.top} />}
          {virtualRows.map((virtualRow) => {
            const hit = searchHits[virtualRow.index];
            if (hit) {
              return (
                <TableRowComponent
                  sx={{ height: virtualRow.size }}
                  numCells={columns.length + (isSelectable ? 1 : 0) + 1}
                  key={hit?._id}
                  // @ts-expect-error the expanded content's props should be the same as the hit's _source
                  expandedContent={ExpandedContent ? <ExpandedContent {...hit?._source} /> : undefined}
                  disabledTooltipTitle={disabledTooltipTitle}
                >
                  {isSelectable && <SelectableRowCell rowKey={hit?._id} disabled={disabledIDs?.has(hit?._id)} />}
                  {columns.map(({ cellContent: CellContent, id }) => (
                    <TableCellComponent key={id}>
                      <CellContent hit={hit._source} trackingInfo={trackingInfo} />
                    </TableCellComponent>
                  ))}
                </TableRowComponent>
              );
            }
            return null;
          })}
          {tableBodyPadding.bottom > 0 && <TablePaddingRow padding={tableBodyPadding.bottom} />}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
}

export default EntityTable;
