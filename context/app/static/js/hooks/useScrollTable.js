import { useRef, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

import { useSortState } from 'js/hooks/useSortState';
import { useScrollSearchHits, useAllSearchIDs } from 'js/hooks/useSearchData';

function useScrollTable({ query, columnNameMapping, initialSortState }) {
  const { allSearchIDs } = useAllSearchIDs(query, {});

  const { sortState, setSort, sort } = useSortState(columnNameMapping, initialSortState);

  const queryWithSort = { ...query, sort };

  const { searchHits, isLoading, loadMore, totalHitsCount } = useScrollSearchHits(queryWithSort, {});

  const tableContainerRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: searchHits.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 52, // Roughly equivalent to size of the entity table rows prior to virtualization.
    overscan: 20,
  });

  const virtualRows = virtualizer.getVirtualItems();

  // Adapted from https://tanstack.com/table/v8/docs/examples/react/virtualized-infinite-scrolling.
  const tableBodyPadding = {
    top: virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0,
    bottom: virtualRows.length > 0 ? virtualizer.getTotalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0) : 0,
  };

  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        if (scrollHeight - scrollTop - clientHeight < 300) {
          loadMore();
        }
      }
    },
    [loadMore],
  );

  return {
    searchHits,
    allSearchIDs,
    isLoading,
    totalHitsCount,
    sortState,
    setSort,
    fetchMoreOnBottomReached,
    virtualRows,
    tableBodyPadding,
    tableContainerRef,
  };
}

export default useScrollTable;
