import React, { SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { trackEvent } from 'js/helpers/trackers';
import {
  useSearchStore,
  isTermFilter,
  isHierarchicalFilter,
  isHierarchicalFacet,
  isTermFacet,
  isExistsFacet,
  isExistsFilter,
  isDateFacet,
  isRangeFacet,
  isDateFilter,
  isRangeFilter,
  filterHasValues,
} from '../store';
import { useSearch } from '../Search';
import { useGetFieldLabel, useGetTransformedFieldValue } from '../fieldConfigurations';
import type { InnerBucket, HierarchicalBucket } from '../Search';

type FacetOptionType = 'TERM' | 'HIERARCHICAL_PARENT' | 'HIERARCHICAL_CHILD' | 'EXISTS' | 'DATE' | 'RANGE';

interface FacetOption {
  field: string;
  value: string;
  count: number;
  groupLabel: string;
  displayValue: string;
  facetType: FacetOptionType;
  parentValue?: string;
  rangeMin?: number;
  rangeMax?: number;
}

interface AggMinMax {
  value?: number | null;
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
                  displayValue: getTransformedFieldValue({ field: facetConfig.childField ?? field, value: childKey }),
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

      if (isDateFacet(facetConfig)) {
        const agg = aggregations[field] as Record<string, AggMinMax> | undefined;
        const aggMin = agg?.[`${field}_min`];
        const aggMax = agg?.[`${field}_max`];
        if (aggMin?.value && aggMax?.value) {
          options.push({
            field,
            value: '_date_control',
            count: 0,
            groupLabel,
            displayValue: groupLabel,
            facetType: 'DATE',
            rangeMin: aggMin.value,
            rangeMax: aggMax.value,
          });
        }
      }

      if (isRangeFacet(facetConfig)) {
        const agg = aggregations[field] as Record<string, { buckets?: { key: string }[] }> | undefined;
        const buckets = agg?.[field]?.buckets;
        if (buckets && Array.isArray(buckets) && buckets.length > 0) {
          const actualMax = Math.max(...buckets.map((b) => parseInt(b.key, 10)));
          options.push({
            field,
            value: '_range_control',
            count: 0,
            groupLabel,
            displayValue: groupLabel,
            facetType: 'RANGE',
            rangeMin: 0,
            rangeMax: actualMax,
          });
        }
      }
    }

    return options;
  }, [aggregations, facets, getFieldLabel, getTransformedFieldValue]);
}

function InlineDateControl({
  option,
  onPickerOpenChange,
}: {
  option: FacetOption;
  onPickerOpenChange: (isOpen: boolean) => void;
}) {
  const filterDate = useSearchStore((state) => state.filterDate);
  const filter = useSearchStore((state) => state.filters[option.field]);
  const analyticsCategory = useSearchStore((state) => state.analyticsCategory);

  const aggMin = option.rangeMin ?? 0;
  const aggMax = option.rangeMax ?? Date.now();

  const currentMin = isDateFilter(filter) ? filter.values.min : undefined;
  const currentMax = isDateFilter(filter) ? filter.values.max : undefined;

  const [localMin, setLocalMin] = useState(currentMin ?? aggMin);
  const [localMax, setLocalMax] = useState(currentMax ?? aggMax);

  useEffect(() => {
    setLocalMin(currentMin ?? aggMin);
    setLocalMax(currentMax ?? aggMax);
  }, [currentMin, currentMax, aggMin, aggMax]);

  const handleMinAccept = useCallback(
    (value: Date | null) => {
      if (!value) return;
      const startOfMonth = new Date(value.getFullYear(), value.getMonth(), 1);
      const newMin = startOfMonth.getTime();
      setLocalMin(newMin);
      if (newMin <= localMax) {
        filterDate({ field: option.field, min: newMin, max: localMax });
        trackEvent({ category: analyticsCategory, action: 'Set Min Date Facet', label: option.field });
      }
    },
    [filterDate, option.field, localMax, analyticsCategory],
  );

  const handleMaxAccept = useCallback(
    (value: Date | null) => {
      if (!value) return;
      const endOfMonth = new Date(value.getFullYear(), value.getMonth() + 1, 0, 23, 59, 59, 999);
      const newMax = Math.min(endOfMonth.getTime(), Date.now());
      setLocalMax(newMax);
      if (newMax >= localMin) {
        filterDate({ field: option.field, min: localMin, max: newMax });
        trackEvent({ category: analyticsCategory, action: 'Set Max Date Facet', label: option.field });
      }
    },
    [filterDate, option.field, localMin, analyticsCategory],
  );

  return (
    <Stack spacing={1} sx={{ px: 2, py: 1, width: '100%' }}>
      <DatePicker
        label="Start"
        value={new Date(localMin)}
        onAccept={handleMinAccept}
        onOpen={() => onPickerOpenChange(true)}
        onClose={() => onPickerOpenChange(false)}
        views={['month', 'year']}
        maxDate={new Date(localMax)}
        slotProps={{
          textField: { size: 'small', fullWidth: true },
          field: { readOnly: true },
        }}
      />
      <DatePicker
        label="End"
        value={new Date(localMax)}
        onAccept={handleMaxAccept}
        onOpen={() => onPickerOpenChange(true)}
        onClose={() => onPickerOpenChange(false)}
        views={['month', 'year']}
        minDate={new Date(localMin)}
        maxDate={new Date()}
        slotProps={{
          textField: { size: 'small', fullWidth: true },
          field: { readOnly: true },
        }}
      />
    </Stack>
  );
}

function InlineRangeControl({ option }: { option: FacetOption }) {
  const filterRange = useSearchStore((state) => state.filterRange);
  const filter = useSearchStore((state) => state.filters[option.field]);
  const analyticsCategory = useSearchStore((state) => state.analyticsCategory);

  const rangeMin = option.rangeMin ?? 0;
  const rangeMax = option.rangeMax ?? 100;

  const currentMin = isRangeFilter(filter) ? filter.values.min : undefined;
  const currentMax = isRangeFilter(filter) ? filter.values.max : undefined;

  const [localValues, setLocalValues] = useState<number[]>([currentMin ?? rangeMin, currentMax ?? rangeMax]);

  useEffect(() => {
    setLocalValues([currentMin ?? rangeMin, currentMax ?? rangeMax]);
  }, [currentMin, currentMax, rangeMin, rangeMax]);

  const handleChange = useCallback((_: Event, value: number | number[]) => {
    if (Array.isArray(value)) {
      setLocalValues(value);
    }
  }, []);

  const handleCommitted = useCallback(
    (_: Event | SyntheticEvent, value: number | number[]) => {
      if (Array.isArray(value)) {
        filterRange({ field: option.field, min: value[0], max: value[1] });
        trackEvent({ category: analyticsCategory, action: 'Set Range Facet', label: option.field });
      }
    },
    [filterRange, option.field, analyticsCategory],
  );

  return (
    <Box sx={{ px: 3, pt: 3, pb: 1, width: '100%' }}>
      <Slider
        size="small"
        value={localValues}
        min={rangeMin}
        max={rangeMax}
        valueLabelDisplay="auto"
        onChange={handleChange}
        onChangeCommitted={handleCommitted}
        getAriaLabel={(index) => (index === 0 ? 'Minimum value' : 'Maximum value')}
      />
    </Box>
  );
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
  const [open, setOpen] = useState(false);
  const paperRef = React.useRef<HTMLDivElement>(null);
  const datePickerOpenRef = React.useRef(false);
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
      // DATE and RANGE options manage their own state via inline controls
      if (option.facetType === 'DATE' || option.facetType === 'RANGE') return;

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
      open={open}
      onOpen={() => setOpen(true)}
      onClose={(event, reason) => {
        if (reason === 'escape') {
          setOpen(false);
          return;
        }
        // Keep open if a date picker popover is currently active (it renders in a portal
        // outside the dropdown, so relatedTarget won't be inside paperRef).
        if (datePickerOpenRef.current) {
          return;
        }
        // On blur, check if focus moved to an element inside the dropdown (e.g. slider).
        if (reason === 'blur' && event && 'relatedTarget' in event) {
          const relatedTarget = event.relatedTarget as Node | null;
          if (relatedTarget && paperRef.current?.contains(relatedTarget)) {
            return;
          }
        }
        setOpen(false);
      }}
      options={allOptions}
      value={[]}
      onChange={(_event, _newValue, _reason, details) => {
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
        paper: { ref: paperRef, sx: { width: 350 } },
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
        if (option.facetType === 'DATE') {
          return (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <li
              key={`${option.facetType}-${option.field}`}
              onMouseDown={(e) => e.preventDefault()}
              style={{ display: 'block', cursor: 'default' }}
            >
              <InlineDateControl
                option={option}
                onPickerOpenChange={(isOpen) => {
                  datePickerOpenRef.current = isOpen;
                }}
              />
            </li>
          );
        }

        if (option.facetType === 'RANGE') {
          return (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <li
              key={`${option.facetType}-${option.field}`}
              onMouseDown={(e) => e.preventDefault()}
              style={{ display: 'block', cursor: 'default' }}
            >
              <InlineRangeControl option={option} />
            </li>
          );
        }

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
