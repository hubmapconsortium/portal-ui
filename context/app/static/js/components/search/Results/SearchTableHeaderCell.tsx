import React, { useCallback, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import Badge from '@mui/material/Badge';

import ColumnFilterDropdown from 'js/shared-styles/tables/ColumnFilterDropdown';
import { trackEvent } from 'js/helpers/trackers';
import { useSearch } from '../Search';
import {
  useSearchStore,
  FACETS,
  isTermFilter,
  isHierarchicalFilter,
  isHierarchicalFacet,
  FacetsType,
  FiltersType,
} from '../store';
import { StyledHeaderCell } from './style';
import type { InnerBucket, HierarchicalBucket } from '../Search';

type FacetFilterType = 'term' | 'hierarchical_parent' | 'hierarchical_child' | 'none';

interface ColumnFacetInfo {
  filterType: FacetFilterType;
  facetField: string;
  childField?: string;
}

/**
 * Maps a table column field to its corresponding facet configuration.
 * Handles exact matches, stem matches, and hierarchical child fields.
 */
export function getColumnFacetInfo(tableField: string, facets: FacetsType): ColumnFacetInfo | null {
  // Exact match
  if (facets[tableField]) {
    const facet = facets[tableField];
    if (facet.type === FACETS.term) {
      return { filterType: 'term', facetField: tableField };
    }
    if (facet.type === FACETS.hierarchical) {
      return { filterType: 'hierarchical_parent', facetField: tableField, childField: facet.childField };
    }
    return null;
  }

  // Check if this field is a hierarchical child field
  for (const [facetField, facet] of Object.entries(facets)) {
    if (isHierarchicalFacet(facet) && facet.childField === tableField) {
      return { filterType: 'hierarchical_child', facetField, childField: tableField };
    }
  }

  // Stem match (e.g., 'mapped_metadata.sex' matches facet key 'mapped_metadata.sex' or 'sex')
  const stem = tableField.split('.').pop();
  if (stem) {
    for (const [facetField, facet] of Object.entries(facets)) {
      const facetStem = facetField.split('.').pop();
      if (facetStem === stem) {
        if (facet.type === FACETS.term) {
          return { filterType: 'term', facetField };
        }
        if (facet.type === FACETS.hierarchical) {
          return { filterType: 'hierarchical_parent', facetField, childField: facet.childField };
        }
      }
    }
  }

  return null;
}

function extractFilterValues(
  columnFacetInfo: ColumnFacetInfo,
  aggregations: Record<string, unknown> | undefined,
): { value: string; count: number }[] {
  if (!aggregations) return [];

  const { filterType, facetField, childField } = columnFacetInfo;

  if (filterType === 'term') {
    const agg = aggregations[facetField] as Record<string, { buckets?: InnerBucket[] }> | undefined;
    const buckets = agg?.[facetField]?.buckets;
    if (!buckets) return [];
    return buckets.map((b) => ({
      value: b.key,
      count: b.doc_count,
    }));
  }

  if (filterType === 'hierarchical_parent') {
    const agg = aggregations[facetField] as Record<string, { buckets?: InnerBucket[] }> | undefined;
    const buckets = agg?.[facetField]?.buckets;
    if (!buckets) return [];
    return buckets.map((b) => ({
      value: b.key,
      count: b.doc_count,
    }));
  }

  if (filterType === 'hierarchical_child' && childField) {
    // Collect child buckets from across all parents
    const agg = aggregations[facetField] as Record<string, { buckets?: HierarchicalBucket[] }> | undefined;
    const parentBuckets = agg?.[facetField]?.buckets;
    if (!parentBuckets) return [];

    const childMap = new Map<string, number>();
    for (const parent of parentBuckets) {
      const childBuckets = (parent[childField] as { buckets?: InnerBucket[] } | undefined)?.buckets;
      if (childBuckets) {
        for (const child of childBuckets) {
          childMap.set(child.key, (childMap.get(child.key) ?? 0) + child.doc_count);
        }
      }
    }

    return Array.from(childMap.entries()).map(([value, count]) => ({ value, count }));
  }

  return [];
}

function getSelectedValues(columnFacetInfo: ColumnFacetInfo, filters: FiltersType): Set<string> {
  const { filterType, facetField } = columnFacetInfo;
  const filter = filters[facetField];
  if (!filter) return new Set();

  if (filterType === 'term' && isTermFilter(filter)) {
    return filter.values;
  }

  if (filterType === 'hierarchical_parent' && isHierarchicalFilter(filter)) {
    // Selected parents are the keys of the values object
    return new Set(Object.keys(filter.values));
  }

  if (filterType === 'hierarchical_child' && isHierarchicalFilter(filter)) {
    // Collect all selected child values across all parents
    const selected = new Set<string>();
    for (const children of Object.values(filter.values)) {
      for (const child of children) {
        selected.add(child);
      }
    }
    return selected;
  }

  return new Set();
}

function HubmapIdSearchPopover() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [inputValue, setInputValue] = useState('');
  const { setSearch, search, analyticsCategory } = useSearchStore(
    useShallow((state) => ({
      setSearch: state.setSearch,
      search: state.search,
      analyticsCategory: state.analyticsCategory,
    })),
  );

  const handleOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      let searchValue = inputValue;
      // Wrap in quotes if it looks like a HuBMAP ID
      if (/^HBM\S+$/i.test(searchValue)) {
        searchValue = `"${searchValue}"`;
      }
      setSearch(searchValue);
      trackEvent({
        category: analyticsCategory,
        action: 'Free Text Search',
        label: searchValue,
      });
      handleClose();
    },
    [inputValue, setSearch, analyticsCategory, handleClose],
  );

  const open = Boolean(anchorEl);
  const hasActiveSearch = Boolean(search);

  return (
    <>
      <IconButton
        onClick={handleOpen}
        size="small"
        color="primary"
        sx={{
          padding: '2px 4px',
          '&:hover': { backgroundColor: 'action.hover' },
        }}
        aria-label="Search HuBMAP IDs"
        data-testid="hubmap-id-search-button"
      >
        <Badge badgeContent={hasActiveSearch ? 1 : 0} color="primary" variant="dot">
          <SearchRoundedIcon fontSize="small" />
        </Badge>
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 1.5, minWidth: 250 }}>
          <TextField
            autoFocus
            size="small"
            fullWidth
            placeholder="Search by HuBMAP ID..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
      </Popover>
    </>
  );
}

interface SearchTableHeaderCellProps {
  field: string;
  label: string;
}

export default function SearchTableHeaderCell({ field, label }: SearchTableHeaderCellProps) {
  const {
    sortField,
    setSortField,
    analyticsCategory,
    facets,
    filters,
    filterTerm,
    filterTerms,
    filterHierarchicalParentTerm,
    filterHierarchicalChildTerm,
  } = useSearchStore(
    useShallow((state) => ({
      sortField: state.sortField,
      setSortField: state.setSortField,
      analyticsCategory: state.analyticsCategory,
      facets: state.facets,
      filters: state.filters,
      filterTerm: state.filterTerm,
      filterTerms: state.filterTerms,
      filterHierarchicalParentTerm: state.filterHierarchicalParentTerm,
      filterHierarchicalChildTerm: state.filterHierarchicalChildTerm,
    })),
  );

  const { aggregations } = useSearch();

  const { direction, field: currentSortField } = sortField;
  const isCurrentSortField = field === currentSortField;
  const active = isCurrentSortField;

  const handleSort = useCallback(() => {
    const newDirection = isCurrentSortField ? (direction === 'desc' ? 'asc' : 'desc') : 'desc';
    setSortField({ direction: newDirection, field });
    trackEvent({
      category: analyticsCategory,
      action: 'Sort Table View',
      label: `${label} ${newDirection}`,
    });
  }, [analyticsCategory, direction, field, isCurrentSortField, label, setSortField]);

  const isHubmapId = field.split('.').pop() === 'hubmap_id';

  const columnFacetInfo = useMemo(() => getColumnFacetInfo(field, facets), [field, facets]);

  const filterValues = useMemo(
    () => (columnFacetInfo ? extractFilterValues(columnFacetInfo, aggregations) : []),
    [columnFacetInfo, aggregations],
  );

  const selectedFilterValues = useMemo(
    () => (columnFacetInfo ? getSelectedValues(columnFacetInfo, filters) : new Set<string>()),
    [columnFacetInfo, filters],
  );

  const handleToggleFilterValue = useCallback(
    (value: string) => {
      if (!columnFacetInfo) return;
      const { filterType, facetField } = columnFacetInfo;

      if (filterType === 'term') {
        filterTerm({ term: facetField, value });
      } else if (filterType === 'hierarchical_parent') {
        filterHierarchicalParentTerm({ term: facetField, value, childValues: [] });
      } else if (filterType === 'hierarchical_child') {
        // Find which parent this child belongs to
        const parentBuckets = (
          aggregations?.[facetField] as Record<string, { buckets?: HierarchicalBucket[] }> | undefined
        )?.[facetField]?.buckets;
        if (parentBuckets) {
          for (const parent of parentBuckets) {
            const childBuckets = (parent[columnFacetInfo.childField!] as { buckets?: InnerBucket[] } | undefined)
              ?.buckets;
            if (childBuckets?.some((c) => c.key === value)) {
              filterHierarchicalChildTerm({ parentTerm: facetField, parentValue: parent.key, value });
              return;
            }
          }
        }
      }

      trackEvent({
        category: analyticsCategory,
        action: 'Toggle Column Filter',
        label: `${label}: ${value}`,
      });
    },
    [
      columnFacetInfo,
      filterTerm,
      filterHierarchicalParentTerm,
      filterHierarchicalChildTerm,
      aggregations,
      analyticsCategory,
      label,
    ],
  );

  const handleClearFilter = useCallback(() => {
    if (!columnFacetInfo) return;
    const { filterType, facetField } = columnFacetInfo;

    if (filterType === 'term') {
      filterTerms({ term: facetField, values: Array.from(selectedFilterValues) });
    } else if (filterType === 'hierarchical_parent') {
      // Deselect all parents
      for (const parentValue of selectedFilterValues) {
        filterHierarchicalParentTerm({ term: facetField, value: parentValue, childValues: [] });
      }
    } else if (filterType === 'hierarchical_child') {
      // Deselect all children
      const filter = filters[facetField];
      if (isHierarchicalFilter(filter)) {
        for (const [parentValue, children] of Object.entries(filter.values)) {
          for (const child of children) {
            filterHierarchicalChildTerm({ parentTerm: facetField, parentValue, value: child });
          }
        }
      }
    }

    trackEvent({
      category: analyticsCategory,
      action: 'Clear Column Filter',
      label,
    });
  }, [
    columnFacetInfo,
    selectedFilterValues,
    filters,
    filterTerms,
    filterHierarchicalParentTerm,
    filterHierarchicalChildTerm,
    analyticsCategory,
    label,
  ]);

  const isFilterable = columnFacetInfo !== null && filterValues.length > 0;

  return (
    <StyledHeaderCell>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
        <TableSortLabel
          active={active}
          direction={active ? direction : undefined}
          onClick={handleSort}
          sx={{
            '> .MuiTableSortLabel-icon': {
              opacity: 0.25,
            },
          }}
        >
          {label}
        </TableSortLabel>
        {isHubmapId && <HubmapIdSearchPopover />}
        {isFilterable && !isHubmapId && (
          <ColumnFilterDropdown
            columnId={field}
            columnLabel={label}
            values={filterValues}
            selectedValues={selectedFilterValues}
            isLoading={false}
            onToggleValue={handleToggleFilterValue}
            onClearFilter={handleClearFilter}
          />
        )}
      </Box>
    </StyledHeaderCell>
  );
}
