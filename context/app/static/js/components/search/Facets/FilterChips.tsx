import React, { useCallback } from 'react';
import Chip, { ChipProps } from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

import { trackEvent } from 'js/helpers/trackers';
import { useSearchStore } from '../store';
import { getFieldLabel } from '../labelMap';

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
  const { terms, filterTerm, ranges, filterRange, hierarchicalTerms, filterHierarchicalChildTerm } = useSearchStore();

  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      {Object.values(terms).map((term) =>
        [...term.values].map((v) => (
          <FilterChip
            label={`${getFieldLabel(term.field)}: ${v}`}
            key={v}
            onDelete={() => filterTerm({ term: term.field, value: v })}
          />
        )),
      )}
      {Object.values(ranges).map(({ field, values, min, max }) => {
        if (values.min === min && values.max === max) {
          return null;
        }
        return (
          <FilterChip
            label={`${getFieldLabel(field)}: ${values.min} - ${values.max}`}
            key={field}
            onDelete={() => filterRange({ field, min, max })}
          />
        );
      })}
      {Object.values(hierarchicalTerms).map((term) =>
        Object.entries(term.values).map(([parent, children]) => {
          return [...children].map((child) => (
            <FilterChip
              label={`${getFieldLabel(term.field)}: ${child}`}
              key={child}
              onDelete={() =>
                filterHierarchicalChildTerm({ parentTerm: term.field, parentValue: parent, value: child })
              }
            />
          ));
        }),
      )}
    </Stack>
  );
}

export default FilterChips;
