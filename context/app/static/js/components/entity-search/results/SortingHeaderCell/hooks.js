import { useState } from 'react';
import { useSearchkit } from '@searchkit/client';

function useSortField(field) {
  const api = useSearchkit();
  const [sortDirection, setSortDirection] = useState('desc');

  function toggleSort() {
    const nextSortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
    api.setSortBy(`${field}.${nextSortDirection}`);
    api.search();
    setSortDirection(nextSortDirection);
  }

  return { sortDirection, toggleSort };
}

export { useSortField };
