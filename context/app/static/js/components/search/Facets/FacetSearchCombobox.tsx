import React, { SyntheticEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { useVirtualizer } from '@tanstack/react-virtual';

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

function optionKey(o: Pick<FacetOption, 'field' | 'value' | 'facetType' | 'parentValue'>): string {
  return `${o.facetType}::${o.field}::${o.value}::${o.parentValue ?? ''}`;
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

/**
 * Stabilizes the option list while the dropdown is open so that options
 * disappearing from aggregation buckets don't cause layout shift.
 * On open: snapshots the full option list.
 * While open: merges new options into the snapshot, keeping disappeared options with count: 0.
 * On close: clears the snapshot.
 */
function useStableOptions(rawOptions: FacetOption[], isOpen: boolean): FacetOption[] {
  const snapshotRef = useRef<Map<string, FacetOption> | null>(null);

  // Build/clear snapshot synchronously based on open state
  if (isOpen && snapshotRef.current === null) {
    const map = new Map<string, FacetOption>();
    for (const opt of rawOptions) {
      map.set(optionKey(opt), opt);
    }
    snapshotRef.current = map;
  } else if (!isOpen && snapshotRef.current !== null) {
    snapshotRef.current = null;
  }

  return useMemo(() => {
    if (!isOpen || !snapshotRef.current) return rawOptions;

    const snapshot = snapshotRef.current;
    const freshKeySet = new Set<string>();
    const freshByField = new Map<string, FacetOption[]>();

    // Index fresh options by key and by field
    for (const opt of rawOptions) {
      const k = optionKey(opt);
      freshKeySet.add(k);
      // Update snapshot with fresh data
      snapshot.set(k, opt);

      const list = freshByField.get(opt.field) ?? [];
      list.push(opt);
      freshByField.set(opt.field, list);
    }

    // Find disappeared options (in snapshot but not in fresh)
    const extrasByField = new Map<string, FacetOption[]>();
    for (const [k, cached] of snapshot) {
      if (!freshKeySet.has(k)) {
        const zeroOpt = { ...cached, count: 0 };
        const list = extrasByField.get(cached.field) ?? [];
        list.push(zeroOpt);
        extrasByField.set(cached.field, list);
      }
    }

    if (extrasByField.size === 0) return rawOptions;

    // Merge extras after the last fresh option of the same field
    const merged = [...rawOptions];
    for (const [field, fieldExtras] of extrasByField) {
      let lastIdx = -1;
      for (let i = merged.length - 1; i >= 0; i--) {
        if (merged[i].field === field) {
          lastIdx = i;
          break;
        }
      }
      if (lastIdx >= 0) {
        merged.splice(lastIdx + 1, 0, ...fieldExtras);
      } else {
        merged.push(...fieldExtras);
      }
    }

    return merged;
  }, [rawOptions, isOpen]);
}

const MemoizedInlineDateControl = React.memo(function InlineDateControl({
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
});

const MemoizedInlineRangeControl = React.memo(function InlineRangeControl({ option }: { option: FacetOption }) {
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
});

// ── Virtualized Listbox ──────────────────────────────────────────────

const HEADER_HEIGHT = 28;
const OPTION_HEIGHT = 36;
const DATE_HEIGHT = 120;
const RANGE_HEIGHT = 72;
const LISTBOX_MAX_HEIGHT = 300;

/**
 * Flatten the grouped children rendered by MUI Autocomplete's renderGroup.
 * Each group is a <li> containing a header element and a <ul> of option children.
 * We flatten this into a single array: [header, opt, opt, ..., header, opt, ...]
 */
interface GroupChildrenTuple {
  children: [React.ReactNode, React.ReactElement<{ children?: React.ReactNode }>];
}

function flattenGroupedChildren(children: React.ReactNode): React.ReactNode[] {
  const items: React.ReactNode[] = [];
  React.Children.forEach(children, (group) => {
    if (!React.isValidElement<GroupChildrenTuple>(group)) return;
    const groupChildren = group.props.children;
    if (!Array.isArray(groupChildren)) return;
    // groupChildren[0] = header Typography, groupChildren[1] = <ul>{options}</ul>
    items.push(groupChildren[0]);
    const ul = groupChildren[1];
    if (React.isValidElement<{ children?: React.ReactNode }>(ul) && ul.props.children) {
      React.Children.forEach(ul.props.children, (option: React.ReactNode) => {
        items.push(option);
      });
    }
  });
  return items;
}

function estimateItemSize(item: React.ReactNode): number {
  if (!React.isValidElement(item)) return OPTION_HEIGHT;
  const props = item.props as Record<string, unknown>;
  if (props['data-group-header']) return HEADER_HEIGHT;
  switch (props['data-facet-type']) {
    case 'DATE':
      return DATE_HEIGHT;
    case 'RANGE':
      return RANGE_HEIGHT;
    default:
      return OPTION_HEIGHT;
  }
}

const VirtualizedListbox = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  function VirtualizedListbox(props, ref) {
    // ownerState is injected by MUI's styled-components integration; strip it to avoid DOM warning
    const {
      children,
      style,
      ownerState: _ownerState,
      ...other
    } = props as React.HTMLAttributes<HTMLUListElement> & {
      ownerState?: unknown;
    };
    const flatItems = useMemo(() => flattenGroupedChildren(children), [children]);
    const scrollRef = useRef<HTMLUListElement>(null);

    const virtualizer = useVirtualizer({
      count: flatItems.length,
      getScrollElement: () => scrollRef.current,
      estimateSize: (index) => estimateItemSize(flatItems[index]),
      overscan: 15,
    });

    const mergedRef = useCallback(
      (node: HTMLUListElement | null) => {
        (scrollRef as React.MutableRefObject<HTMLUListElement | null>).current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    return (
      <ul {...other} ref={mergedRef} style={{ ...style, maxHeight: LISTBOX_MAX_HEIGHT, overflow: 'auto', width: 350 }}>
        <div
          role="presentation"
          style={{
            height: virtualizer.getTotalSize(),
            position: 'relative',
            width: '100%',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => (
            <div
              key={virtualRow.index}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              role="presentation"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {flatItems[virtualRow.index]}
            </div>
          ))}
        </div>
      </ul>
    );
  },
);

// ── Memoized checkbox option ─────────────────────────────────────────

const CheckboxOption = React.memo(function CheckboxOption({
  option,
  selected,
  dimmed,
  ...liProps
}: {
  option: FacetOption;
  selected: boolean;
  dimmed: boolean;
} & React.HTMLAttributes<HTMLLIElement>) {
  const isChild = option.facetType === 'HIERARCHICAL_CHILD';
  const isParent = option.facetType === 'HIERARCHICAL_PARENT';

  return (
    <li {...liProps}>
      <Checkbox checked={selected} size="small" sx={{ mr: 1, p: 0, ml: isChild ? 2 : 0 }} tabIndex={-1} disableRipple />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          alignItems: 'center',
          overflow: 'hidden',
          opacity: dimmed ? 0.5 : 1,
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
        <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
          ({option.count.toLocaleString()})
        </Typography>
      </Box>
    </li>
  );
});

// ── Main component ───────────────────────────────────────────────────

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

  const rawOptions = useFacetOptions();
  const allOptions = useStableOptions(rawOptions, open);

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
        if (datePickerOpenRef.current) {
          return;
        }
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
      }}
      ListboxComponent={VirtualizedListbox}
      renderGroup={(params) => (
        <li key={params.key}>
          <Typography
            data-group-header
            variant="body2"
            fontWeight={600}
            color="text.secondary"
            sx={{
              px: 2,
              py: 0.5,
              lineHeight: 1.3,
              bgcolor: 'background.paper',
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
              data-facet-type="DATE"
              onMouseDown={(e) => e.preventDefault()}
              style={{ display: 'block', cursor: 'default' }}
            >
              <MemoizedInlineDateControl
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
              data-facet-type="RANGE"
              onMouseDown={(e) => e.preventDefault()}
              style={{ display: 'block', cursor: 'default' }}
            >
              <MemoizedInlineRangeControl option={option} />
            </li>
          );
        }

        const selected = isOptionSelected(option);
        const dimmed = option.count === 0 && !selected;
        return (
          <CheckboxOption
            key={`${option.facetType}-${option.field}-${option.value}`}
            data-facet-type={option.facetType}
            option={option}
            selected={selected}
            dimmed={dimmed}
            {...rest}
          />
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
