import React from 'react';
import IconButton from '@mui/material/IconButton';

import { useSearchStore } from '../store';

import { ArrowUpOn, ArrowDownOn, ArrowDownOff, StyledHeaderCell } from './style';

export function OrderIcon({ direction }: { direction: 'asc' | 'desc' }) {
  if (direction === 'asc') return <ArrowUpOn />;
  if (direction === 'desc') return <ArrowDownOn />;
}

function SortingTableHead({ field, label }: { field: string; label: string }) {
  const { sortField, setSortField } = useSearchStore();

  const { direction, field: currentSortField } = sortField;

  if (field !== currentSortField) {
    return (
      <StyledHeaderCell>
        {label}
        <IconButton onClick={() => setSortField({ field, direction: 'desc' })}>
          <ArrowDownOff />
        </IconButton>
      </StyledHeaderCell>
    );
  }

  return (
    <StyledHeaderCell>
      {label}
      <IconButton onClick={() => setSortField({ field, direction: direction === 'desc' ? 'asc' : 'desc' })}>
        <OrderIcon direction={direction} />
      </IconButton>
    </StyledHeaderCell>
  );
}

export default SortingTableHead;
