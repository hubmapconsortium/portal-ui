import { useRef, useCallback, UIEvent, useState, useEffect, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { SearchHit, SearchRequest } from 'js/typings/elasticsearch';

import { useSortState, ColumnNameMapping, SortState } from 'js/hooks/useSortState';
import { useScrollSearchHits, useAllSearchIDs, useSearchHits } from 'js/hooks/useSearchData';
import { useColumnFilters } from 'js/hooks/useColumnFilters';
import { Column } from 'js/shared-styles/tables/EntitiesTable/types';

// Constants for row height calculation

const LONG_FIELDS = ['description', 'summary', 'title', 'name', 'data_types', 'status', 'group_name', 'anatomy'];
const DEFAULT_CHARACTERS_PER_LINE = 15;
const BASE_ROW_HEIGHT = 53; // MUI default row height
const DEFAULT_LINE_HEIGHT = 20; // Approximate height per line of text
const DEFAULT_MAX_LINES = 4; // Maximum lines to consider for height estimation

/**
 * Utility function to create a content height estimator based on specific fields
 */
function createContentHeightEstimator<T>(
  fields = LONG_FIELDS,
  charactersPerLine = DEFAULT_CHARACTERS_PER_LINE,
  lineHeight = DEFAULT_LINE_HEIGHT,
  maxLines = DEFAULT_MAX_LINES,
) {
  return (hit: SearchHit<T>, _isExpanded: boolean): number => {
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

    return BASE_ROW_HEIGHT + Math.min(additionalHeight, lineHeight * maxLines);
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

const noOp = () => {};

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

  // Determine if we're using custom sorting
  const currentColumn = columns.find((col) => col.id === sortState.columnId);
  const isCustomSort = Boolean(currentColumn?.customSortValues && !currentColumn.sort);

  // For custom sorting, we need to fetch all results and sort client-side
  // For ES sorting, use the existing scroll-based approach
  const queryWithSort = isCustomSort ? query : ({ ...query, sort } as SearchRequest);

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

  // Use different data fetching strategies based on sort type
  const scrollData = useScrollSearchHits(filteredQuery, {}) as UseScrollSearchHitsTypes<Document>;

  const { searchHits: allSearchHits, isLoading: allDataLoading } = useSearchHits<Document>(filteredQuery, {
    shouldFetch: isCustomSort,
  });

  // Apply custom sorting when needed
  const sortedSearchHits = useMemo(() => {
    if (!isCustomSort || !currentColumn?.customSortValues) {
      return scrollData.searchHits;
    }

    const hits = allSearchHits.map((hit) => hit as SearchHit<Document>);
    const customSortValues = currentColumn.customSortValues;

    return hits.sort((a, b) => {
      const aId = a._id;
      const bId = b._id;

      const aValue = aId && customSortValues[aId];
      const bValue = bId && customSortValues[bId];

      // Handle undefined values (put them at the end)
      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      // Sort based on data type
      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else {
        comparison = Number(aValue) - Number(bValue);
      }

      // Apply sort direction
      return sortState.direction === 'desc' ? -comparison : comparison;
    });
  }, [isCustomSort, currentColumn?.customSortValues, allSearchHits, scrollData.searchHits, sortState.direction]);

  // Use the appropriate data source
  const searchHits = isCustomSort ? sortedSearchHits : scrollData.searchHits;
  const isLoading = isCustomSort ? allDataLoading : scrollData.isLoading;
  // Pagination is disabled for custom sort because custom sort needs all results' values to be known to ensure correctness
  const loadMore = useMemo(() => (isCustomSort ? noOp : scrollData.loadMore), [isCustomSort, scrollData.loadMore]); // No pagination for custom sort
  const totalHitsCount = isCustomSort ? searchHits.length : scrollData.totalHitsCount;

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
    (rowId?: string) => {
      return rowId && expandedRows.has(rowId);
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
        return BASE_ROW_HEIGHT;
      }

      const hit = searchHits[index];
      // Use the same row ID logic as EntityTable for consistency
      const source = hit._source as Record<string, unknown>;
      const rowId = (source?.hubmap_id as string) ?? hit._id;
      const isExpanded = expandedRows.has(rowId);

      // For expandable tables, handle expanded state
      if (isExpandable && isExpanded) {
        const expandedHeight = BASE_ROW_HEIGHT + estimatedExpandedRowHeight;

        // Also account for content in the base row
        const contentHeight = estimator(hit, isExpanded);
        return Math.max(expandedHeight, BASE_ROW_HEIGHT + contentHeight + estimatedExpandedRowHeight);
      }

      // For non-expanded rows, estimate based on content (but more conservatively)
      const contentHeight = estimator(hit, isExpanded);
      // For non-expanded rows, limit the content height to avoid extremely tall rows
      const maxContentHeightForNonExpanded = DEFAULT_LINE_HEIGHT * 2; // Allow up to 2 extra lines
      const limitedContentHeight = Math.min(contentHeight, maxContentHeightForNonExpanded);
      return BASE_ROW_HEIGHT + limitedContentHeight;
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
