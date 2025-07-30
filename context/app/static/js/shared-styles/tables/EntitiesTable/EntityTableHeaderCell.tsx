import React from 'react';

import { useEventCallback } from '@mui/material/utils';

import { HeaderCell } from 'js/shared-styles/tables';
import { SortState } from 'js/hooks/useSortState';
import { EventInfo } from 'js/components/types';
import { trackEvent } from 'js/helpers/trackers';
import InfoTextTooltip from 'js/shared-styles/tooltips/InfoTextTooltip';
import TableSortLabel from '@mui/material/TableSortLabel';
import { Column } from './types';

interface EntityHeaderCellTypes<Doc> {
  column: Column<Doc>;
  setSort: (columnId: string) => void;
  sortState: SortState;
  trackingInfo?: EventInfo;
}

export default function EntityHeaderCell<Doc>({
  column: { tooltipText, ...column },
  setSort,
  sortState,
  trackingInfo,
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

  if (column.noSort) {
    return (
      <HeaderCell key={id} sx={{ backgroundColor: 'background.paper' }}>
        {label}
      </HeaderCell>
    );
  }

  return (
    <HeaderCell key={id} sx={{ backgroundColor: 'background.paper' }}>
      <TableSortLabel
        active={sortState.columnId === id}
        direction={sortState.direction}
        onClick={handleClick}
        sx={{
          whiteSpace: 'nowrap',
          '& .MuiTableSortLabel-icon': {
            opacity: 0.5,
          },
        }}
      >
        {label}
      </TableSortLabel>
    </HeaderCell>
  );
}
