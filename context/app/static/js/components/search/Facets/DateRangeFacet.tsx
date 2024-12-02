import React, { useCallback, useState, useEffect, useMemo } from 'react';
import Stack from '@mui/material/Stack';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { DateValidationError } from '@mui/x-date-pickers/models';
import { format } from 'date-fns/format';

import { trackEvent } from 'js/helpers/trackers';
import { useSearch } from '../Search';
import { isDateFilter, useSearchStore } from '../store';
import { useGetFieldLabel } from '../fieldConfigurations';
import FacetAccordion from './FacetAccordion';

interface DateRangeFacetProps {
  field: string;
}

function DatePickerComponent({
  minDate,
  maxDate,
  ...rest
}: DatePickerProps<Date> & Partial<Pick<DatePickerProps<Date>, 'minDate' | 'maxDate'>>) {
  const [error, setError] = useState<DateValidationError | null>(null);

  const errorMessage = useMemo(() => {
    switch (error) {
      case 'maxDate':
        return maxDate ? `Please select a date of ${format(maxDate, 'MMMM yyyy')} or before.` : null;

      case 'minDate': {
        return minDate ? `Please select a date of ${format(minDate, 'MMMM yyyy')} or after.` : null;
      }

      case 'invalidDate': {
        return 'The date is not valid.';
      }

      default: {
        return null;
      }
    }
  }, [error, minDate, maxDate]);

  return (
    <DatePicker
      sx={(theme) => ({
        '.MuiOutlinedInput-input, .MuiInputLabel-root, .MuiMonthCalendar-root': {
          fontSize: theme.typography.subtitle2.fontSize,
        },
      })}
      views={['month', 'year']}
      onError={setError}
      minDate={minDate}
      maxDate={maxDate}
      slotProps={{
        textField: {
          helperText: errorMessage,
          sx: (theme) => ({
            svg: {
              color: theme.palette.primary.main,
            },
          }),
        },
        field: {
          readOnly: true,
        },
        popper: {
          sx: (theme) => ({
            '.MuiDateCalendar-root': {
              height: 'auto',
              padding: theme.spacing(1.25),
              paddingBottom: theme.spacing(2.5),
            },
            '.MuiPickersMonth-monthButton.Mui-disabled, .MuiPickersYear-yearButton.Mui-disabled': {
              color: theme.palette.text.disabled,
            },
          }),
        },
      }}
      {...rest}
    />
  );
}

function DateRangeFacet({ field, min, max }: DateRangeFacetProps & { min: number; max: number }) {
  const filterDate = useSearchStore((state) => state.filterDate);
  const analyticsCategory = useSearchStore((state) => state.analyticsCategory);

  const [values, setValues] = useState([min, max]);
  const getFieldLabel = useGetFieldLabel();

  // Reset slider position when filter chip is deleted.
  useEffect(() => {
    setValues([min, max]);
  }, [min, max, setValues]);

  const filterMin = useCallback(
    (value: Date | null) => {
      if (value) {
        trackEvent({
          category: analyticsCategory,
          action: 'Set Min Date Facet',
          label: field,
        });

        const newMin = value.getTime();
        setValues([newMin, values[1]]);
        if (newMin <= values[1]) {
          filterDate({ field, min: newMin, max });
        }
      }
    },
    [filterDate, max, field, setValues, values, analyticsCategory],
  );

  const filterMax = useCallback(
    (value: Date | null) => {
      if (value) {
        trackEvent({
          category: analyticsCategory,
          action: 'Set Max Date Facet',
          label: field,
        });

        const newMax = value.getTime();
        setValues([values[0], newMax]);
        if (newMax >= values[0]) {
          filterDate({ field, min, max: newMax });
        }
      }
    },
    [filterDate, min, field, setValues, values, analyticsCategory],
  );

  return (
    <FacetAccordion title={getFieldLabel(field)} position="inner">
      <Stack spacing={1.5} mt={1}>
        <DatePickerComponent
          label="Start"
          value={new Date(values[0])}
          onAccept={filterMin}
          maxDate={new Date(values[1])}
        />
        <DatePickerComponent
          label="End"
          value={new Date(values[1])}
          views={['month', 'year']}
          onAccept={filterMax}
          minDate={new Date(values[0])}
          maxDate={new Date()}
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

  return <DateRangeFacet field={field} min={min ?? aggMin.value} max={max ?? aggMax.value} {...rest} />;
}

export default DateRangeFacetGuard;
