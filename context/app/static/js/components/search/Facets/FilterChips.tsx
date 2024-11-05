import React, { ReactElement, useCallback } from 'react';
import Chip, { ChipProps } from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { trackEvent } from 'js/helpers/trackers';
import {
  HierarchicalTermValues,
  RangeValues,
  TermValues,
  isHierarchicalFacet,
  isHierarchicalFilter,
  isRangeFacet,
  isRangeFilter,
  isTermFilter,
  useSearchStore,
} from '../store';
import { getFieldLabel, getTransformedFieldValue } from '../fieldConfigurations';

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

  return <Chip variant="outlined" color="primary" label={label} onDelete={handleDelete} {...props} />;
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

  const filter = useCallback(
    () => filterHierarchicalChildTerm({ parentTerm: parentField, parentValue, value }),
    [parentField, value, parentValue, filterHierarchicalChildTerm],
  );

  return <FilterChip label={`${getFieldLabel(parentField)}: ${value}`} key={value} onDelete={filter} />;
});

function ResetFiltersButton() {
  const resetFilters = useSearchStore((state) => state.resetFilters);
  return (
    <Button variant="outlined" onClick={resetFilters}>
      Clear Filters
    </Button>
  );
}

function FilterChips() {
  const filters = useSearchStore((state) => state.filters);
  const facets = useSearchStore((state) => state.facets);
  const filterTerm = useSearchStore((state) => state.filterTerm);
  const filterRange = useSearchStore((state) => state.filterRange);

  const chips: ReactElement<{ children: (ReactElement | null)[] }> = (
    <>
      {Object.entries(filters).map(([field, v]: [string, RangeValues | HierarchicalTermValues | TermValues]) => {
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
          const { min, max } = facetConfig;
          if (v.values.min === min && v.values.max === max) {
            return null;
          }
          return (
            <FilterChip
              label={`${getFieldLabel(field)}: ${v.values.min} - ${v.values.max}`}
              key={field}
              onDelete={() => filterRange({ field, min, max })}
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
        return null;
      })}
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
