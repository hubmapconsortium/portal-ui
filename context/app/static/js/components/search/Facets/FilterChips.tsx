import React, { ReactElement, useCallback } from 'react';
import Box from '@mui/material/Box';
import Chip, { ChipProps } from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { format } from 'date-fns/format';

import { trackEvent } from 'js/helpers/trackers';
import {
  DateValues,
  ExistsValues,
  HierarchicalTermValues,
  RangeValues,
  TermValues,
  isDateFacet,
  isDateFilter,
  isExistsFilter,
  isExistsFacet,
  isHierarchicalFacet,
  isHierarchicalFilter,
  isRangeFacet,
  isRangeFilter,
  isTermFilter,
  useSearchStore,
  filterHasValues,
} from '../store';
import { useGetFieldLabel, useGetTransformedFieldValue } from '../fieldConfigurations';

function FilterChip({ onDelete, label, ...props }: ChipProps & { onDelete: () => void }) {
  const analyticsCategory = useSearchStore((state) => state.analyticsCategory);

  const handleDelete = useCallback(() => {
    onDelete();
    trackEvent({
      category: analyticsCategory,
      action: 'Unselect Facet Chip',
      label,
    });
  }, [onDelete, label, analyticsCategory]);

  return (
    <Chip
      variant="outlined"
      color="primary"
      label={label}
      onDelete={handleDelete}
      sx={(theme) => ({
        borderColor: theme.palette.primary.main,
      })}
      {...props}
    />
  );
}
const HierarchichalTermChip = React.memo(function HierarchicalTermChip({
  parentField,
  parentValue,
  value,
}: {
  parentField: string;
  parentValue: string;
  value: string;
}) {
  const filterHierarchicalChildTerm = useSearchStore((state) => state.filterHierarchicalChildTerm);
  const getFieldLabel = useGetFieldLabel();
  const filter = useCallback(
    () => filterHierarchicalChildTerm({ parentTerm: parentField, parentValue, value }),
    [parentField, value, parentValue, filterHierarchicalChildTerm],
  );

  return <FilterChip label={`${getFieldLabel(parentField)}: ${value}`} key={value} onDelete={filter} />;
});

function ResetFiltersButton() {
  const resetFilters = useSearchStore((state) => state.resetFilters);
  return (
    <Box flexShrink={0}>
      <Button variant="outlined" onClick={resetFilters}>
        Clear Filters
      </Button>
    </Box>
  );
}

function FilterChips() {
  const filters = useSearchStore((state) => state.filters);
  const facets = useSearchStore((state) => state.facets);
  const filterTerm = useSearchStore((state) => state.filterTerm);
  const filterRange = useSearchStore((state) => state.filterRange);
  const filterDate = useSearchStore((state) => state.filterDate);
  const filterExists = useSearchStore((state) => state.filterExists);
  const getFieldLabel = useGetFieldLabel();
  const getTransformedFieldValue = useGetTransformedFieldValue();

  const chips: ReactElement<{ children: (ReactElement | null)[] }> = (
    <>
      {Object.entries(filters).map(
        ([field, v]: [string, RangeValues | HierarchicalTermValues | TermValues | DateValues | ExistsValues]) => {
          if (isTermFilter(v) && v.values.size) {
            return [...v.values].map((val) => (
              <FilterChip
                label={`${getFieldLabel(field)}: ${getTransformedFieldValue({ field, value: val })}`}
                key={val}
                onDelete={() => filterTerm({ term: field, value: val })}
              />
            ));
          }
          const facetConfig = facets[field];

          if (isRangeFilter(v) && isRangeFacet(facetConfig)) {
            if (v.values.min === undefined && v.values.max === undefined) {
              return null;
            }
            return (
              <FilterChip
                label={`${getFieldLabel(field)}: ${v.values.min} - ${v.values.max}`}
                key={field}
                onDelete={() => filterRange({ field, min: undefined, max: undefined })}
              />
            );
          }

          if (isDateFilter(v) && isDateFacet(facetConfig)) {
            if (!(v.values.min && v.values.max)) {
              return null;
            }

            return (
              <FilterChip
                label={`${getFieldLabel(field)}: ${format(v.values.min, 'yyyy-MM')} - ${format(v.values.max, 'yyyy-MM')}`}
                key={field}
                onDelete={() => filterDate({ field, min: undefined, max: undefined })}
              />
            );
          }

          if (isHierarchicalFilter(v) && isHierarchicalFacet(facetConfig)) {
            const parentValues = Object.entries(v.values);

            if (!parentValues.length) {
              return null;
            }
            return parentValues.map(([parent, children]) => {
              return [...children].map((child) => (
                <HierarchichalTermChip
                  key={`${parent}-${child}`}
                  parentField={field}
                  value={child}
                  parentValue={parent}
                />
              ));
            });
          }

          const hasValues = filterHasValues({ filter: v, facet: facetConfig });

          if (isExistsFilter(v) && isExistsFacet(facetConfig) && hasValues) {
            return (
              <FilterChip
                label={`${getFieldLabel(field)}: ${v.values}`}
                key={field}
                onDelete={() => filterExists({ field })}
              />
            );
          }

          return null;
        },
      )}
    </>
  );

  return (
    <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ width: '100%' }}>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {chips}
      </Stack>
      {Boolean(chips?.props?.children.filter((c) => c).length) && <ResetFiltersButton />}
    </Stack>
  );
}

export default FilterChips;
