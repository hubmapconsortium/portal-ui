import React, { useCallback } from 'react';
import Chip, { ChipProps } from '@mui/material/Chip';
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

function FilterChips() {
  const filters = useSearchStore((state) => state.filters);
  const facets = useSearchStore((state) => state.facets);
  const filterTerm = useSearchStore((state) => state.filterTerm);
  const filterRange = useSearchStore((state) => state.filterRange);

  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      {Object.entries(filters).map(([field, v]: [string, RangeValues | HierarchicalTermValues | TermValues]) => {
        if (isTermFilter(v)) {
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
          return Object.entries(v.values).map(([parent, children]) => {
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
    </Stack>
  );
}

export default FilterChips;
