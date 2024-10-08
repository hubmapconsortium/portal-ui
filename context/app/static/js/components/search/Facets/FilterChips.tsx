import React, { useCallback } from 'react';
import Chip, { ChipProps } from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

import { trackEvent } from 'js/helpers/trackers';
import {
  HierarchichalTermValues,
  RangeValues,
  TermValues,
  isHierarchicalFacet,
  isHierarchicalFilter,
  isRangeFacet,
  isRangeFilter,
  isTermFilter,
  useSearchStore,
} from '../store';
import { getFieldLabel, getTransformedFieldalue } from '../fieldConfigurations';

function FilterChip({ onDelete, label, ...props }: ChipProps & { onDelete: () => void }) {
  const { analyticsCategory } = useSearchStore();

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

function FilterChips() {
  const { filters, facets, filterTerm, filterRange, filterHierarchicalChildTerm } = useSearchStore();

  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      {Object.entries(filters).map(([field, v]: [string, RangeValues | HierarchichalTermValues | TermValues]) => {
        if (isTermFilter(v)) {
          return [...v.values].map((val) => (
            <FilterChip
              label={`${getFieldLabel(field)}: ${getTransformedFieldalue({ field, value: val })}`}
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
              <FilterChip
                label={`${getFieldLabel(field)}: ${child}`}
                key={child}
                onDelete={() => filterHierarchicalChildTerm({ parentTerm: field, parentValue: parent, value: child })}
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
