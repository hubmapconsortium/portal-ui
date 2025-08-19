import { useState, useCallback, useMemo } from 'react';
import { SearchRequest } from '@elastic/elasticsearch/lib/api/types';

import { Column } from 'js/shared-styles/tables/EntitiesTable/types';
import useSearchData from './useSearchData';

export type ColumnFilterState = Record<string, Set<string>>;

export type ColumnAggregations = Record<
  string,
  | {
      buckets: {
        key: string;
        doc_count: number;
      }[];
    }
  | {
      values: {
        buckets: {
          key: string;
          doc_count: number;
        }[];
      };
    }
>;

interface UseColumnFiltersProps<Doc> {
  columns: Column<Doc>[];
  baseQuery: SearchRequest;
  enabled?: boolean;
}

export function useColumnFilters<Doc>({ columns, baseQuery, enabled = true }: UseColumnFiltersProps<Doc>) {
  const [filters, setFilters] = useState<ColumnFilterState>({});

  const filterableColumns = useMemo(() => columns.filter((col) => col.filterable && col.sort), [columns]);

  // Build aggregations query for filterable columns
  const aggregationsQuery = useMemo(() => {
    if (!enabled || filterableColumns.length === 0) {
      return null;
    }

    const queryWithFilters = { ...baseQuery };

    // Apply post_filter constraints to the query section for aggregations
    // This ensures aggregations are computed on the same subset of data as the main results
    if (baseQuery.post_filter) {
      if (queryWithFilters.query) {
        queryWithFilters.query = {
          bool: {
            must: [queryWithFilters.query, baseQuery.post_filter],
          },
        };
      } else {
        queryWithFilters.query = baseQuery.post_filter;
      }
    }

    // Use the filtered query structure and add aggregations
    const query: SearchRequest = {
      ...queryWithFilters,
      size: 0, // We only want aggregations, not hits
      // Remove post_filter from aggregations query since we've moved it to the query section
      post_filter: undefined,
      aggs: {},
    };

    // Add aggregations for each filterable column with per-column filtering
    filterableColumns.forEach((column) => {
      if (column.sort && query.aggs) {
        // For each column's aggregation, apply filters from OTHER columns only
        // This allows users to see all options for the current column while respecting other filters
        const otherColumnFilters = Object.entries(filters)
          .filter(([columnId, values]) => columnId !== column.id && values.size > 0)
          .map(([columnId, values]) => {
            const filterColumn = filterableColumns.find((col) => col.id === columnId);
            if (!filterColumn?.sort) return null;

            return {
              terms: {
                [filterColumn.sort]: Array.from(values),
              },
            };
          })
          .filter((clause): clause is NonNullable<typeof clause> => clause !== null);

        if (otherColumnFilters.length > 0) {
          // Create a filtered aggregation that excludes the current column's filters
          query.aggs[column.id] = {
            filter: {
              bool: {
                must: otherColumnFilters,
              },
            },
            aggs: {
              values: {
                terms: {
                  field: column.sort,
                  size: 10000, // Large size to get all possible values
                  order: { _count: 'desc' },
                },
              },
            },
          };
        } else {
          // No other filters, use simple terms aggregation
          query.aggs[column.id] = {
            terms: {
              field: column.sort,
              size: 10000, // Large size to get all possible values
              order: { _count: 'desc' },
            },
          };
        }
      }
    });

    return query;
  }, [baseQuery, filterableColumns, enabled, filters]);

  // Fetch aggregations
  const { searchData: aggregationsData, isLoading: aggregationsLoading } = useSearchData<unknown, ColumnAggregations>(
    aggregationsQuery ?? { query: { match_all: {} } },
    {
      shouldFetch: Boolean(aggregationsQuery),
    },
  );

  // Apply filters to the base query
  const filteredQuery = useMemo(() => {
    const activeFilters = Object.entries(filters).filter(([, values]) => values.size > 0);

    if (activeFilters.length === 0) {
      return baseQuery;
    }

    const filterClauses = activeFilters
      .map(([columnId, values]) => {
        const column = filterableColumns.find((col) => col.id === columnId);
        if (!column?.sort) return null;

        return {
          terms: {
            [column.sort]: Array.from(values),
          },
        };
      })
      .filter((clause): clause is NonNullable<typeof clause> => clause !== null);

    if (filterClauses.length === 0) {
      return baseQuery;
    }

    // Create a new query combining existing query with filters
    const newQuery = { ...baseQuery };
    if (baseQuery.query) {
      newQuery.query = {
        bool: {
          must: [baseQuery.query, ...filterClauses],
        },
      };
    } else {
      newQuery.query = {
        bool: {
          must: filterClauses,
        },
      };
    }

    return newQuery;
  }, [baseQuery, filters, filterableColumns]);

  // Filter management functions
  const setColumnFilter = useCallback((columnId: string, values: Set<string>) => {
    setFilters((prev) => ({
      ...prev,
      [columnId]: values,
    }));
  }, []);

  const clearColumnFilter = useCallback((columnId: string) => {
    setFilters((prev) => {
      const { [columnId]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({});
  }, []);

  const toggleFilterValue = useCallback((columnId: string, value: string) => {
    setFilters((prev) => {
      const currentValues = prev[columnId] || new Set();
      const newValues = new Set(currentValues);

      if (newValues.has(value)) {
        newValues.delete(value);
      } else {
        newValues.add(value);
      }

      return {
        ...prev,
        [columnId]: newValues,
      };
    });
  }, []);

  // Get available values for a column from aggregations
  const getColumnValues = useCallback(
    (columnId: string) => {
      if (!aggregationsData?.aggregations?.[columnId]) {
        return [];
      }

      const aggregation = aggregationsData.aggregations[columnId];

      // Handle nested filtered aggregations
      if ('values' in aggregation && aggregation.values?.buckets) {
        return aggregation.values.buckets.map((bucket: { key: string; doc_count: number }) => ({
          value: bucket.key,
          count: bucket.doc_count,
        }));
      }

      // Handle simple terms aggregations
      if ('buckets' in aggregation) {
        return aggregation.buckets.map((bucket: { key: string; doc_count: number }) => ({
          value: bucket.key,
          count: bucket.doc_count,
        }));
      }

      return [];
    },
    [aggregationsData],
  );

  // Get selected values for a column
  const getColumnSelectedValues = useCallback(
    (columnId: string) => {
      return filters[columnId] || new Set();
    },
    [filters],
  );

  return {
    filters,
    filteredQuery,
    filterableColumns,
    aggregationsLoading,
    setColumnFilter,
    clearColumnFilter,
    clearAllFilters,
    toggleFilterValue,
    getColumnValues,
    getColumnSelectedValues,
  };
}
