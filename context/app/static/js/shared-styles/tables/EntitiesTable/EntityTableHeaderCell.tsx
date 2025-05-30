import React from 'react';

import Button from '@mui/material/Button';
import { useEventCallback } from '@mui/material/utils';

import { HeaderCell } from 'js/shared-styles/tables';
import { OrderIcon } from 'js/components/searchPage/SortingTableHead/SortingTableHead';
import { SortState } from 'js/hooks/useSortState';
import { EventInfo } from 'js/components/types';
import { trackEvent } from 'js/helpers/trackers';
import { Column } from './types';

interface EntityHeaderCellTypes<Doc> {
  column: Column<Doc>;
  setSort: (columnId: string) => void;
  sortState: SortState;
  trackingInfo?: EventInfo;
}

export default function EntityHeaderCell<Doc>({
  column,
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

  if (column.noSort) {
    return (
      <HeaderCell key={column.id} sx={({ palette }) => ({ backgroundColor: palette.background.paper })}>
        {column.label}
      </HeaderCell>
    );
  }

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
        onClick={handleClick}
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
