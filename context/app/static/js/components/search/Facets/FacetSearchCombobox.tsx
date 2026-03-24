import React, { useCallback, useMemo, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import InputAdornment from '@mui/material/InputAdornment';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

import { trackEvent } from 'js/helpers/trackers';
import {
  useSearchStore,
  isTermFilter,
  isHierarchicalFilter,
  isHierarchicalFacet,
  isTermFacet,
  isExistsFacet,
  isExistsFilter,
  filterHasValues,
} from '../store';
import { useSearch } from '../Search';
import { useGetFieldLabel, useGetTransformedFieldValue } from '../fieldConfigurations';
import type { InnerBucket, HierarchicalBucket } from '../Search';

type FacetOptionType = 'TERM' | 'HIERARCHICAL_PARENT' | 'HIERARCHICAL_CHILD' | 'EXISTS';

interface FacetOption {
  field: string;
  value: string;
  count: number;
  groupLabel: string;
  displayValue: string;
  facetType: FacetOptionType;
  parentValue?: string;
}

function useFacetOptions(): FacetOption[] {
  const facets = useSearchStore((state) => state.facets);
  const { aggregations } = useSearch();
  const getFieldLabel = useGetFieldLabel();
  const getTransformedFieldValue = useGetTransformedFieldValue();

  return useMemo(() => {
    if (!aggregations) return [];
    const options: FacetOption[] = [];

    for (const [field, facetConfig] of Object.entries(facets)) {
      const groupLabel = getFieldLabel(field);

      if (isTermFacet(facetConfig)) {
        const agg = aggregations[field] as Record<string, { buckets?: InnerBucket[] }> | undefined;
        const buckets = agg?.[field]?.buckets;
        if (buckets) {
          for (const bucket of buckets) {
            const key = String(bucket.key_as_string ?? bucket.key);
            options.push({
              field,
              value: key,
              count: bucket.doc_count,
              groupLabel,
              displayValue: getTransformedFieldValue({ field, value: key }),
              facetType: 'TERM',
            });
          }
        }
      }

      if (isHierarchicalFacet(facetConfig)) {
        const agg = aggregations[field] as Record<string, { buckets?: HierarchicalBucket[] }> | undefined;
        const parentBuckets = agg?.[field]?.buckets;
        if (parentBuckets) {
          for (const parent of parentBuckets) {
            const parentKey = String(parent.key_as_string ?? parent.key);
            options.push({
              field,
              value: parentKey,
              count: parent.doc_count,
              groupLabel,
              displayValue: getTransformedFieldValue({ field, value: parentKey }),
              facetType: 'HIERARCHICAL_PARENT',
            });

            const childBuckets = (parent[facetConfig.childField] as { buckets?: InnerBucket[] } | undefined)?.buckets;
            if (childBuckets) {
              for (const child of childBuckets) {
                const childKey = String(child.key_as_string ?? child.key);
                options.push({
                  field,
                  value: childKey,
                  count: child.doc_count,
                  groupLabel,
                  displayValue: childKey,
                  facetType: 'HIERARCHICAL_CHILD',
                  parentValue: parentKey,
                });
              }
            }
          }
        }
      }

      if (isExistsFacet(facetConfig)) {
        options.push({
          field,
          value: 'true',
          count: 0,
          groupLabel,
          displayValue: groupLabel,
          facetType: 'EXISTS',
        });
      }
    }

    return options;
  }, [aggregations, facets, getFieldLabel, getTransformedFieldValue]);
}

function FacetSearchCombobox() {
  const filterTerm = useSearchStore((state) => state.filterTerm);
  const filterHierarchicalParentTerm = useSearchStore((state) => state.filterHierarchicalParentTerm);
  const filterHierarchicalChildTerm = useSearchStore((state) => state.filterHierarchicalChildTerm);
  const filterExists = useSearchStore((state) => state.filterExists);
  const analyticsCategory = useSearchStore((state) => state.analyticsCategory);
  const filters = useSearchStore((state) => state.filters);
  const facets = useSearchStore((state) => state.facets);

  const [inputValue, setInputValue] = useState('');
  const allOptions = useFacetOptions();

  const isOptionSelected = useCallback(
    (option: FacetOption): boolean => {
      const filter = filters[option.field];
      if (!filter) return false;

      if (option.facetType === 'TERM' && isTermFilter(filter)) {
        return filter.values.has(option.value);
      }
      if (option.facetType === 'HIERARCHICAL_PARENT' && isHierarchicalFilter(filter)) {
        return option.value in filter.values;
      }
      if (option.facetType === 'HIERARCHICAL_CHILD' && isHierarchicalFilter(filter) && option.parentValue) {
        return filter.values[option.parentValue]?.has(option.value) ?? false;
      }
      if (option.facetType === 'EXISTS' && isExistsFilter(filter) && isExistsFacet(facets[option.field])) {
        return Boolean(filterHasValues({ filter }));
      }
      return false;
    },
    [filters, facets],
  );

  const toggleOption = useCallback(
    (option: FacetOption) => {
      switch (option.facetType) {
        case 'TERM':
          filterTerm({ term: option.field, value: option.value });
          break;
        case 'HIERARCHICAL_PARENT':
          filterHierarchicalParentTerm({ term: option.field, value: option.value, childValues: [] });
          break;
        case 'HIERARCHICAL_CHILD':
          if (option.parentValue) {
            filterHierarchicalChildTerm({
              parentTerm: option.field,
              parentValue: option.parentValue,
              value: option.value,
            });
          }
          break;
        case 'EXISTS':
          filterExists({ field: option.field });
          break;
      }

      trackEvent({
        category: analyticsCategory,
        action: 'Select Facet via Combobox',
        label: `${option.groupLabel}: ${option.displayValue}`,
      });
    },
    [filterTerm, filterHierarchicalParentTerm, filterHierarchicalChildTerm, filterExists, analyticsCategory],
  );

  return (
    <Autocomplete<FacetOption, true, true, false>
      multiple
      disableClearable
      options={allOptions}
      value={[]}
      onChange={(_event, _newValue, reason, details) => {
        if (details?.option) {
          toggleOption(details.option);
        }
      }}
      inputValue={inputValue}
      onInputChange={(_event, newInputValue, reason) => {
        if (reason !== 'reset') {
          setInputValue(newInputValue);
        }
      }}
      groupBy={(option) => option.groupLabel}
      getOptionLabel={(option) => option.displayValue}
      isOptionEqualToValue={(option, value) =>
        option.field === value.field && option.value === value.value && option.facetType === value.facetType
      }
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search filters"
          size="small"
          variant="outlined"
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            },
          }}
        />
      )}
      slotProps={{
        paper: { sx: { width: 350 } },
        listbox: { sx: { width: 350 } },
      }}
      renderGroup={(params) => (
        <li key={params.key}>
          <Typography
            variant="body2"
            fontWeight={600}
            color="text.secondary"
            sx={{
              px: 2,
              py: 0.5,
              lineHeight: 1.3,
              position: 'sticky',
              top: -8,
              bgcolor: 'background.paper',
              zIndex: 1,
            }}
          >
            {params.group}
          </Typography>
          <ul style={{ padding: 0 }}>{params.children}</ul>
        </li>
      )}
      renderOption={({ key: _key, ...rest }, option) => {
        const selected = isOptionSelected(option);
        const isChild = option.facetType === 'HIERARCHICAL_CHILD';
        const isParent = option.facetType === 'HIERARCHICAL_PARENT';
        return (
          <li key={`${option.facetType}-${option.field}-${option.value}`} {...rest}>
            <Checkbox
              checked={selected}
              size="small"
              sx={{ mr: 1, p: 0, ml: isChild ? 2 : 0 }}
              tabIndex={-1}
              disableRipple
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'center',
                overflow: 'hidden',
              }}
            >
              <Typography
                variant="body2"
                noWrap
                sx={{ flexGrow: 1, mr: 1, fontWeight: isParent ? 600 : 400 }}
                title={option.displayValue}
              >
                {isParent ? `All ${option.displayValue}` : option.displayValue}
              </Typography>
              {option.count > 0 && (
                <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                  ({option.count})
                </Typography>
              )}
            </Box>
          </li>
        );
      }}
      renderTags={() => null}
      filterOptions={(options, { inputValue: input }) => {
        const lowerInput = input.toLowerCase();
        return options.filter(
          (option) =>
            option.displayValue.toLowerCase().includes(lowerInput) ||
            option.groupLabel.toLowerCase().includes(lowerInput),
        );
      }}
      disableCloseOnSelect
      size="small"
      sx={{ mb: 1 }}
      data-testid="facet-search-combobox"
    />
  );
}

export default FacetSearchCombobox;
