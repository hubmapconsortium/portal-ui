import React from 'react';
import { useEventCallback } from '@mui/material/utils';
import TableSortLabel from '@mui/material/TableSortLabel';
import Box from '@mui/material/Box';

import { HeaderCell } from 'js/shared-styles/tables';
import { SortState } from 'js/hooks/useSortState';
import { EventInfo } from 'js/components/types';
import { trackEvent } from 'js/helpers/trackers';
import InfoTextTooltip from 'js/shared-styles/tooltips/InfoTextTooltip';
import ColumnFilterDropdown from 'js/shared-styles/tables/ColumnFilterDropdown';
import { Column } from './types';

interface FilterValue {
  value: string;
  count: number;
}

interface EntityHeaderCellTypes<Doc> {
  column: Column<Doc>;
  setSort: (columnId: string) => void;
  sortState: SortState;
  trackingInfo?: EventInfo;
  // Filter props
  filterValues?: FilterValue[];
  selectedFilterValues?: Set<string>;
  isFilterLoading?: boolean;
  onToggleFilterValue?: (value: string) => void;
  onClearFilter?: () => void;
}

export default function EntityHeaderCell<Doc>({
  column: { tooltipText, ...column },
  setSort,
  sortState,
  trackingInfo,
  filterValues = [],
  selectedFilterValues = new Set(),
  isFilterLoading = false,
  onToggleFilterValue,
  onClearFilter,
}: EntityHeaderCellTypes<Doc>) {
  const handleClick = useEventCallback(() => {
    if (trackingInfo) {
      trackEvent({
        ...trackingInfo,
        action: `${trackingInfo.action} / Sort Table`,
        label: `${trackingInfo.label} ${column.label}`,
      });
    }
    setSort(column.id);
  });

  const { id } = column;

  const label = tooltipText ? (
    <InfoTextTooltip infoIconSize="medium" tooltipTitle={tooltipText}>
      {column.label}
    </InfoTextTooltip>
  ) : (
    column.label
  );

  const isFilterable = column.filterable && column.sort && !column.noSort;

  if (column.noSort) {
    return (
      <HeaderCell key={id} sx={{ backgroundColor: 'background.paper' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {label}
          {isFilterable && onToggleFilterValue && onClearFilter && (
            <ColumnFilterDropdown
              columnId={column.id}
              columnLabel={column.label}
              values={filterValues}
              selectedValues={selectedFilterValues}
              isLoading={isFilterLoading}
              onToggleValue={onToggleFilterValue}
              onClearFilter={onClearFilter}
            />
          )}
        </Box>
      </HeaderCell>
    );
  }

  const active = sortState.columnId === id;

  return (
    <HeaderCell
      key={id}
      sx={{
        backgroundColor: 'background.paper',
        width: {
          sx: 'auto',
          lg: column.width ?? 'max-content',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <TableSortLabel
          active={active}
          direction={active ? sortState.direction : undefined}
          onClick={handleClick}
          sx={{
            '> .MuiTableSortLabel-icon': {
              opacity: 0.25,
            },
          }}
        >
          {label}
        </TableSortLabel>
        {isFilterable && onToggleFilterValue && onClearFilter && (
          <ColumnFilterDropdown
            columnId={column.id}
            columnLabel={column.label}
            values={filterValues}
            selectedValues={selectedFilterValues}
            isLoading={isFilterLoading}
            onToggleValue={onToggleFilterValue}
            onClearFilter={onClearFilter}
          />
        )}
      </Box>
    </HeaderCell>
  );
}
