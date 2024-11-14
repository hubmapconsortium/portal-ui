import React, { useCallback, useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useSearch } from '../Search';
import { isDateFilter, useSearchStore } from '../store';
import { getFieldLabel } from '../fieldConfigurations';
import FacetAccordion from './FacetAccordion';

interface DateRangeFacetProps {
  field: string;
}

function DateRangeFacet({ field, min, max }: DateRangeFacetProps & { min: number; max: number }) {
  const filterRange = useSearchStore((state) => state.filterRange);
  const [values, setValues] = useState([min, max]);

  // Reset slider position when filter chip is deleted.
  useEffect(() => {
    setValues([min, max]);
  }, [min, max, setValues]);

  const filterMin = useCallback(
    (value: Date | null) => {
      if (value) {
        const newMin = value.getTime();
        setValues([newMin, values[1]]);
        filterRange({ field, min: newMin, max });
      }
    },
    [filterRange, max, field, setValues, values],
  );

  const filterMax = useCallback(
    (value: Date | null) => {
      if (value) {
        const newMax = value.getTime();
        setValues([values[0], newMax]);
        filterRange({ field, min, max: newMax });
      }
    },
    [filterRange, min, field, setValues, values],
  );

  return (
    <FacetAccordion title={getFieldLabel(field)} position="inner">
      <Stack spacing={1.5} mt={1}>
        <DatePicker
          sx={(theme) => ({
            '.MuiOutlinedInput-input, .MuiInputLabel-root, .MuiMonthCalendar-root': {
              fontSize: theme.typography.subtitle2.fontSize,
            },
          })}
          value={new Date(values[0])}
          label="Start"
          views={['month', 'year']}
          onAccept={filterMin}
        />
        <DatePicker
          sx={(theme) => ({
            '.MuiOutlinedInput-input, .MuiInputLabel-root, .MuiMonthCalendar-root': {
              fontSize: theme.typography.subtitle2.fontSize,
            },
          })}
          value={new Date(values[1])}
          label="End"
          views={['month', 'year']}
          onChange={filterMax}
        />
      </Stack>
    </FacetAccordion>
  );
}

function DateRangeFacetGuard({ field, ...rest }: DateRangeFacetProps) {
  const { aggregations } = useSearch();

  const filter = useSearchStore((state) => state.filters[field]);

  if (!aggregations || !isDateFilter(filter)) {
    return null;
  }

  const {
    values: { min, max },
  } = filter;

  const {
    [field]: { [`${field}_min`]: aggMin, [`${field}_max`]: aggMax },
  } = aggregations;

  if (!('value' in aggMin && 'value' in aggMax)) {
    return null;
  }

  if (!aggMin?.value || !aggMax?.value) {
    return null;
  }

  return <DateRangeFacet field={field} min={min ?? aggMin?.value} max={max ?? aggMax?.value} {...rest} />;
}

export default DateRangeFacetGuard;
