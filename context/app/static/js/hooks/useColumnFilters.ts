import { useState, useCallback, useMemo } from 'react';
import { SearchRequest } from '@elastic/elasticsearch/lib/api/types';
import esb from 'elastic-builder';

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

    // Start with a base query structure
    const query: SearchRequest = {
      size: 0, // We only want aggregations, not hits
      aggs: {},
    };

    // Build the base query including post_filter constraints
    // Apply post_filter constraints to the query section for aggregations
    // This ensures aggregations are computed on the same subset of data as the main results
    const queryClauses = [];
    if (baseQuery.query) {
      queryClauses.push(baseQuery.query);
    }
    if (baseQuery.post_filter) {
      queryClauses.push(baseQuery.post_filter);
    }

    if (queryClauses.length > 1) {
      query.query = {
        bool: {
          must: queryClauses,
        },
      };
    } else if (queryClauses.length === 1) {
      const [firstQuery] = queryClauses;
      query.query = firstQuery;
    } else {
      query.query = { match_all: {} };
    }

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

            return esb.termsQuery(filterColumn.sort, Array.from(values)).toJSON();
          })
          .filter((clause): clause is NonNullable<typeof clause> => clause !== null);

        if (otherColumnFilters.length > 0) {
          // Create a filtered aggregation that excludes the current column's filters
          const filterQuery =
            otherColumnFilters.length > 1 ? { bool: { must: otherColumnFilters } } : otherColumnFilters[0];

          query.aggs[column.id] = {
            filter: filterQuery,
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

        return esb.termsQuery(column.sort, Array.from(values)).toJSON();
      })
      .filter((clause): clause is NonNullable<typeof clause> => clause !== null);

    if (filterClauses.length === 0) {
      return baseQuery;
    }

    // Create a new query combining existing query with filters
    const newQuery = { ...baseQuery };

    if (baseQuery.query) {
      // Combine existing query with filter clauses
      const allClauses = [baseQuery.query, ...filterClauses];
      newQuery.query = {
        bool: {
          must: allClauses,
        },
      };
    } else {
      // No existing query, just use the filters
      const [firstFilter, ...restFilters] = filterClauses;
      if (restFilters.length === 0) {
        newQuery.query = firstFilter;
      } else {
        newQuery.query = {
          bool: {
            must: filterClauses,
          },
        };
      }
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
