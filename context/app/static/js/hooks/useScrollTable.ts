import { useRef, useCallback, UIEvent, useState, useEffect, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { SearchHit, SearchRequest } from '@elastic/elasticsearch/lib/api/types';

import { useSortState, ColumnNameMapping, SortState } from 'js/hooks/useSortState';
import { useScrollSearchHits, useAllSearchIDs } from 'js/hooks/useSearchData';
import { useColumnFilters } from 'js/hooks/useColumnFilters';
import { Column } from 'js/shared-styles/tables/EntitiesTable/types';

/**
 * Utility function to create a content height estimator based on specific fields
 */
function createContentHeightEstimator<T>(fields: string[], charactersPerLine = 15, lineHeight = 20, maxLines = 4) {
  return (hit: SearchHit<T>, _isExpanded: boolean): number => {
    const baseHeight = 53; // MUI default row height
    let additionalHeight = 0;

    const source = hit._source as Record<string, unknown>;

    fields.forEach((field) => {
      const fieldValue = source?.[field];
      if (fieldValue && typeof fieldValue === 'string') {
        const estimatedLines = Math.ceil(fieldValue.length / charactersPerLine);
        if (estimatedLines > 1) {
          additionalHeight += (estimatedLines - 1) * lineHeight;
        }
      }
    });

    return baseHeight + Math.min(additionalHeight, lineHeight * maxLines);
  };
}

interface AllSearchIDsTypes {
  allSearchIDs: string[];
}

interface ScrollTableTypes<Doc> {
  query: SearchRequest;
  columnNameMapping: ColumnNameMapping;
  initialSortState: SortState;
  columns: Column<Doc>[];
  /** Whether the table supports expandable rows */
  isExpandable?: boolean;
  /** Height estimate for expanded content in pixels (default: 200px) */
  estimatedExpandedRowHeight?: number;
}

interface UseScrollSearchHitsTypes<Document> {
  searchHits: SearchHit<Document>[];
  isLoading: boolean;
  loadMore: () => void;
  totalHitsCount: number;
}

// Constants for row height calculation - defined outside callback for performance
const baseRowHeight = 53; // normal MUI table row, since we don't use dense rows
const lineHeight = 20; // Approximate height per line of text

function useScrollTable<Document>({
  query,
  columnNameMapping,
  initialSortState,
  columns,
  isExpandable = false,
  estimatedExpandedRowHeight = 200,
}: ScrollTableTypes<Document>) {
  const { allSearchIDs } = useAllSearchIDs(query) as AllSearchIDsTypes;

  const { sortState, setSort, sort } = useSortState(columnNameMapping, initialSortState);

  const queryWithSort = { ...query, sort } as SearchRequest;

  // Initialize column filters
  const {
    filteredQuery,
    aggregationsLoading,
    setColumnFilter,
    clearColumnFilter,
    clearAllFilters,
    toggleFilterValue,
    getColumnValues,
    getColumnSelectedValues,
  } = useColumnFilters({
    columns,
    baseQuery: queryWithSort,
    enabled: true,
  });

  const { searchHits, isLoading, loadMore, totalHitsCount } = useScrollSearchHits(
    filteredQuery,
    {},
  ) as UseScrollSearchHitsTypes<Document>;

  // Track which rows are expanded for accurate size estimation
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Track if we've already initialized the first row expansion to prevent re-expansion
  const hasInitializedExpansion = useRef(false);

  // Initialize the first row as expanded when search hits are available
  useEffect(() => {
    if (isExpandable && searchHits.length > 0 && !hasInitializedExpansion.current) {
      // Use the same row ID logic as EntityTable for consistency
      const firstHit = searchHits[0];
      const source = firstHit._source as Record<string, unknown>;
      const firstRowId = (source?.hubmap_id as string) ?? firstHit._id;
      setExpandedRows(new Set([firstRowId]));
      hasInitializedExpansion.current = true;
    }
  }, [isExpandable, searchHits]);

  // Function to toggle row expansion state
  const toggleRowExpansion = useCallback((rowId: string, isExpanded: boolean) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (isExpanded) {
        newSet.add(rowId);
      } else {
        newSet.delete(rowId);
      }
      return newSet;
    });
  }, []);

  // Function to check if a row is expanded
  const isRowExpanded = useCallback(
    (rowId: string) => {
      return expandedRows.has(rowId);
    },
    [expandedRows],
  );

  // Create a content height estimator based on common text fields
  // This helps improve row height estimation accuracy
  // especially for rows with variable-length text content
  const estimator = useMemo(
    () =>
      createContentHeightEstimator(
        ['description', 'summary', 'title', 'name', 'data_types', 'status', 'group_name', 'anatomy'],
        15,
        20,
        4,
      ),
    [],
  );

  const tableContainerRef = useRef(null);

  // Calculate precise row height estimation based on actual expansion state and content
  const estimateSize = useCallback(
    (index: number) => {
      if (!searchHits[index]) {
        return baseRowHeight;
      }

      const hit = searchHits[index];
      // Use the same row ID logic as EntityTable for consistency
      const source = hit._source as Record<string, unknown>;
      const rowId = (source?.hubmap_id as string) ?? hit._id;
      const isExpanded = expandedRows.has(rowId);

      // For expandable tables, handle expanded state
      if (isExpandable && isExpanded) {
        const expandedHeight = baseRowHeight + estimatedExpandedRowHeight;

        // Also account for content in the base row
        const contentHeight = estimator(hit, isExpanded);
        return Math.max(expandedHeight, baseRowHeight + contentHeight + estimatedExpandedRowHeight);
      }

      // For non-expanded rows, estimate based on content (but more conservatively)
      const contentHeight = estimator(hit, isExpanded);
      // For non-expanded rows, limit the content height to avoid extremely tall rows
      const maxContentHeightForNonExpanded = lineHeight * 2; // Allow up to 2 extra lines
      const limitedContentHeight = Math.min(contentHeight, maxContentHeightForNonExpanded);
      return baseRowHeight + limitedContentHeight;
    },
    [searchHits, expandedRows, isExpandable, estimatedExpandedRowHeight, estimator],
  );

  const virtualizer = useVirtualizer({
    count: searchHits.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize,
    overscan: 20,
  });

  // Re-measure all rows when expansion state changes
  // This ensures the virtualizer updates its calculations
  useEffect(() => {
    if (isExpandable && expandedRows.size > 0) {
      // Re-measure when rows are expanded/collapsed
      virtualizer.measure();
    }
  }, [expandedRows, virtualizer, isExpandable, searchHits.length]);

  const virtualRows = virtualizer.getVirtualItems();

  // Memoize tableBodyPadding calculation for better performance
  // This avoids recalculating padding on every render and optimizes array access
  const tableBodyPadding = useMemo(() => {
    if (virtualRows.length === 0) {
      return { top: 0, bottom: 0 };
    }

    const firstVirtualRow = virtualRows[0];
    const lastVirtualRow = virtualRows[virtualRows.length - 1];
    const totalSize = virtualizer.getTotalSize();

    return {
      top: firstVirtualRow?.start || 0,
      bottom: totalSize - (lastVirtualRow?.end || 0),
    };
  }, [virtualRows, virtualizer]);

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
    // Column filter functionality
    aggregationsLoading,
    setColumnFilter,
    clearColumnFilter,
    clearAllFilters,
    toggleFilterValue,
    getColumnValues,
    getColumnSelectedValues,
    // Row expansion functionality
    toggleRowExpansion,
    isRowExpanded,
  };
}

export default useScrollTable;
