import { useRef, useCallback, UIEvent } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { SearchHit, SearchRequest } from '@elastic/elasticsearch/lib/api/types';

import { useSortState, ColumnNameMapping, SortState } from 'js/hooks/useSortState';
import { useScrollSearchHits, useAllSearchIDs } from 'js/hooks/useSearchData';

interface AllSearchIDsTypes {
  allSearchIDs: string[];
}

interface ScrollTableTypes {
  query: SearchRequest;
  columnNameMapping: ColumnNameMapping;
  initialSortState: SortState;
}

interface UseScrollSearchHitsTypes<Document> {
  searchHits: SearchHit<Document>[];
  isLoading: boolean;
  loadMore: () => void;
  totalHitsCount: number;
}

function useScrollTable<Document>({ query, columnNameMapping, initialSortState }: ScrollTableTypes) {
  const { allSearchIDs } = useAllSearchIDs(query) as AllSearchIDsTypes;

  const { sortState, setSort, sort } = useSortState(columnNameMapping, initialSortState);

  const queryWithSort = { ...query, sort } as SearchRequest;

  const { searchHits, isLoading, loadMore, totalHitsCount } = useScrollSearchHits(
    queryWithSort,
    {},
  ) as UseScrollSearchHitsTypes<Document>;

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
    bottom: virtualRows.length > 0 ? virtualizer.getTotalSize() - (virtualRows?.[virtualRows.length - 1]?.end || 0) : 0,
  };

  const fetchMoreOnBottomReached = useCallback(
    ({ currentTarget: containerRefElement }: UIEvent<HTMLElement>) => {
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
