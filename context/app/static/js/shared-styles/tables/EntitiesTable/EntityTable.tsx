import React, { useCallback } from 'react';

import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import LinearProgress from '@mui/material/LinearProgress';

import { StyledTableContainer, HeaderCell } from 'js/shared-styles/tables';
import SelectableHeaderCell from 'js/shared-styles/tables/SelectableHeaderCell';
import SelectableRowCell from 'js/shared-styles/tables/SelectableRowCell';
import useScrollTable from 'js/hooks/useScrollTable';
import NumSelectedHeader from 'js/shared-styles/tables/NumSelectedHeader';
import { Entity, EventInfo } from 'js/components/types';
import { EntitiesTabTypes } from './types';
import ExpandableRow from '../ExpandableRow';
import ExpandableRowCell from '../ExpandableRowCell';
import EntityHeaderCell from './EntityTableHeaderCell';

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
  numSelected?: number;
  disabledIDs?: Set<string>;
  trackingInfo?: EventInfo;
  expandTooltip?: string;
  collapseTooltip?: string;
  disabledTooltipTitle?: string;
  maxHeight?: number;
  onSelectAllChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange?: (event: React.ChangeEvent<HTMLInputElement>, id: string) => void;
  reverseExpandIndicator?: boolean;
  onExpand?: (id: string) => (isExpanded: boolean) => void;
  estimatedExpandedRowHeight?: number;
}

const headerRowHeight = 60;

function EntityTable<Doc extends Entity>({
  query,
  columns,
  disabledIDs,
  isSelectable = true,
  trackingInfo,
  expandedContent: ExpandedContent,
  expandTooltip,
  collapseTooltip,
  disabledTooltipTitle,
  maxHeight,
  numSelected,
  onSelectAllChange,
  onSelectChange,
  reverseExpandIndicator,
  onExpand,
  estimatedExpandedRowHeight,
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
    aggregationsLoading,
    toggleFilterValue,
    getColumnValues,
    getColumnSelectedValues,
    clearColumnFilter,
    toggleRowExpansion,
    isRowExpanded,
  } = useScrollTable<Doc>({
    query,
    columnNameMapping,
    initialSortState: { columnId: 'last_modified_timestamp', direction: 'desc' },
    columns,
    isExpandable,
    estimatedExpandedRowHeight,
  });

  const expandableHeaderCell = (
    <HeaderCell aria-hidden sx={({ palette }) => ({ backgroundColor: palette.background.paper })} />
  );

  // Create a combined onExpand handler that tracks expansion state and calls the external callback
  const handleRowExpansion = useCallback(
    (id: string) => (isExpanded: boolean) => {
      // Update internal expansion tracking
      toggleRowExpansion(id, isExpanded);
      // Call external callback if provided
      onExpand?.(id)(isExpanded);
    },
    [toggleRowExpansion, onExpand],
  );

  return (
    <StyledTableContainer
      component={Paper}
      ref={tableContainerRef}
      onScroll={(event) => fetchMoreOnBottomReached(event)}
      maxHeight={maxHeight}
    >
      {isSelectable && numSelected !== undefined && <NumSelectedHeader numSelected={numSelected} />}
      <Table stickyHeader>
        <TableHead sx={{ position: 'relative' }}>
          <TableRow sx={{ height: headerRowHeight }}>
            {isExpandable && reverseExpandIndicator && expandableHeaderCell}
            {isSelectable && (
              <SelectableHeaderCell
                allTableRowKeys={allSearchIDs}
                disabledTableRowKeys={disabledIDs}
                disabled={false}
                sx={({ palette }) => ({
                  backgroundColor: palette.background.paper,
                })}
                onSelectAllChange={onSelectAllChange}
              />
            )}
            {columns.map((column) => (
              <EntityHeaderCell
                column={column}
                setSort={setSort}
                sortState={sortState}
                key={column.id}
                trackingInfo={trackingInfo}
                // Filter props
                filterValues={getColumnValues(column.id)}
                selectedFilterValues={getColumnSelectedValues(column.id)}
                isFilterLoading={aggregationsLoading}
                onToggleFilterValue={(value) => toggleFilterValue(column.id, value)}
                onClearFilter={() => clearColumnFilter(column.id)}
              />
            ))}
            {isExpandable && !reverseExpandIndicator && expandableHeaderCell}
          </TableRow>
          <TableRow aria-hidden="true">
            <TableCell
              colSpan={columns.length + (isSelectable ? 1 : 0) + (isExpandable ? 1 : 0)}
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
              const rowId = hit?._source?.hubmap_id ?? hit._id;
              const isCurrentlyExpanded = isRowExpanded(rowId);

              // Include expansion state in key to force remount
              const key = rowId + (isCurrentlyExpanded ? '-expanded' : '');

              return (
                // @ts-expect-error `numCells` and the other props are only needed when `ExpandedContent` is defined
                // since this indicates that the row is expandable
                <TableRowComponent
                  key={key}
                  {...(ExpandedContent
                    ? {
                        // @ts-expect-error the expanded content's props should be the same as the hit's _source
                        expandedContent: <ExpandedContent {...hit?._source} />,
                        isExpandedToStart: isCurrentlyExpanded,
                        numCells: columns.length + (isSelectable ? 2 : 1),
                        expandTooltip,
                        collapseTooltip,
                        disabledTooltipTitle,
                        reverse: reverseExpandIndicator,
                        onExpand: handleRowExpansion(rowId),
                      }
                    : {})}
                >
                  {isSelectable && (
                    <SelectableRowCell
                      rowKey={hit?._id}
                      rowName={hit?._source?.hubmap_id}
                      onSelectChange={onSelectChange}
                      disabled={disabledIDs?.has(hit?._id)}
                      cellComponent={TableCellComponent}
                    />
                  )}
                  {columns.map(({ cellContent: CellContent, id, width }) => (
                    <TableCellComponent
                      key={id}
                      sx={{
                        width: {
                          xs: 'auto',
                          lg: width ?? 'auto',
                        },
                      }}
                    >
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
