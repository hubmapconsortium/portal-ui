import React, { ComponentType } from 'react';
import { SearchHit, SearchRequest } from '@elastic/elasticsearch/lib/api/types';

import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

import { StyledTableContainer, HeaderCell } from 'js/shared-styles/tables';
import SelectableHeaderCell from 'js/shared-styles/tables/SelectableHeaderCell';
import SelectableRowCell from 'js/shared-styles/tables/SelectableRowCell';

import { OrderIcon } from 'js/components/searchPage/SortingTableHead/SortingTableHead';
import { LinearProgress } from '@mui/material';
import useScrollTable from 'js/hooks/useScrollTable';
import { SortState } from 'js/hooks/useSortState';

interface Column<Doc> {
  label: string;
  id: string;
  sort?: string;
  cellContent: ComponentType<{ hit: SearchHit<Doc> }>;
}

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

const headerRowHeight = 60;

interface EntityTableType<Doc> {
  query: SearchRequest;
  columns: Column<Doc>[];
}

function EntityTable<Doc>({ query, columns }: EntityTableType<Doc>) {
  const columnNameMapping = columns.reduce((acc, column) => ({ ...acc, [column.id]: column.sort }), {});

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
    >
      <Table stickyHeader>
        <TableHead sx={{ position: 'relative' }}>
          <TableRow sx={{ height: headerRowHeight }}>
            <SelectableHeaderCell
              allTableRowKeys={allSearchIDs}
              disabled={false}
              sx={({ palette }) => ({ backgroundColor: palette.background.paper })}
            />
            {columns.map((column) => (
              <EntityHeaderCell column={column} setSort={setSort} sortState={sortState} key={column.id} />
            ))}
          </TableRow>
          <TableRow aria-hidden="true">
            <TableCell
              colSpan={columns.length + 1}
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
          {tableBodyPadding.top > 0 && (
            <tr>
              <td style={{ height: `${tableBodyPadding.top}px` }} aria-hidden="true" />
            </tr>
          )}
          {virtualRows.map((virtualRow) => (
            <TableRow sx={{ height: virtualRow.size }} key={searchHits[virtualRow.index]?._id}>
              <SelectableRowCell rowKey={searchHits[virtualRow.index]?._id} />
              {columns.map(({ cellContent: CellContent, id }) => (
                <CellContent hit={searchHits[virtualRow.index]} key={id} />
              ))}
            </TableRow>
          ))}
          {tableBodyPadding.bottom > 0 && (
            <tr>
              <td style={{ height: `${tableBodyPadding.bottom}px` }} aria-hidden="true" />
            </tr>
          )}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
}

export default EntityTable;
