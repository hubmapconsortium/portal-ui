import React, { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';

import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useSearch } from '../Search';
import { RangeConfig, RangeValues, isRangeFacet, isRangeFilter, useSearchStore } from '../store';
import FacetAccordion from './FacetAccordion';
import { getFieldLabel } from '../fieldConfigurations';

interface HistogramBucket {
  doc_count: number;
  key: string;
}

function buildBins({ buckets }: { buckets: HistogramBucket[] }) {
  const maxCount = Math.max(...buckets.map((b) => b.doc_count));
  return buckets.map((b) => ({ ...b, height: b.doc_count / maxCount }));
}

function RangeFacet({ filter, field, facet }: { filter: RangeValues; field: string; facet: RangeConfig }) {
  const { aggregations } = useSearch();
  const { filterRange } = useSearchStore();
  const theme = useTheme();

  const { values } = filter;
  const { min, max } = facet;

  const [selectedValues, setSelectedValues] = useState<number[]>([min, max]);

  // Reset slider position when filter chip is deleted.
  useEffect(() => {
    setSelectedValues([values.min, values.max]);
  }, [values, setSelectedValues]);

  const handleChange = useCallback(
    (_: Event, value: number | number[]) => {
      if (!Array.isArray(value)) {
        return;
      }
      setSelectedValues(value);
    },
    [setSelectedValues],
  );

  const handleCommittedChange = useCallback(
    (_: Event | SyntheticEvent, value: number | number[]) => {
      if (!Array.isArray(value)) {
        return;
      }

      filterRange({ field, min: value[0], max: value[1] });
    },
    [filterRange, field],
  );

  const aggBuckets = aggregations?.[field]?.[field]?.buckets;

  if (!aggBuckets || !Array.isArray(aggBuckets)) {
    return null;
  }

  const bins = buildBins({ buckets: aggBuckets });

  return (
    <FacetAccordion title={getFieldLabel(field)} position="inner">
      <Box sx={{ width: '90%' }}>
        <Stack direction="row" sx={{ height: 50 }} alignItems="end">
          {bins.map((bin) => {
            const key = parseInt(bin.key, 10);
            return (
              <Box
                key={bin.key}
                sx={{
                  width: `${100 / bins.length}%`,
                  height: `${bin.height * 100}%`,
                  backgroundColor:
                    key >= values.min && key <= values.max ? theme.palette.success.light : theme.palette.secondary.main,
                  pointerEvents: 'none',
                }}
              />
            );
          })}
        </Stack>
        <Slider
          size="small"
          getAriaLabel={(index) => (index === 0 ? 'Minimum value' : 'Maximum value')}
          id={field}
          value={[selectedValues[0], selectedValues[1]]}
          min={min}
          max={max}
          valueLabelDisplay="auto"
          onChange={handleChange}
          onChangeCommitted={handleCommittedChange}
          marks={[
            { value: min, label: min },
            { value: max, label: max },
          ]}
          sx={{
            width: '100%',
            '.MuiSlider-mark': {
              display: 'none',
            },
          }}
        />
      </Box>
    </FacetAccordion>
  );
}

function FacetGuard({ field }: { field: string }) {
  const {
    filters: { [field]: filter },
    facets: { [field]: facet },
  } = useSearchStore();

  if (!isRangeFilter(filter) || !isRangeFacet(facet)) {
    return null;
  }

  return <RangeFacet field={field} facet={facet} filter={filter} />;
}

export default FacetGuard;
