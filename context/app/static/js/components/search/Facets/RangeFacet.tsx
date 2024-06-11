import React from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useTheme } from '@mui/material/styles';

import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useSearch } from '../Search';
import { useSearchStore } from '../store';
import FacetAccordion from './FacetAccordion';
import { getFieldLabel } from '../labelMap';

interface HistogramBucket {
  doc_count: number;
  key: string;
}

function buildBins({ buckets }: { buckets: HistogramBucket[] }) {
  const maxCount = Math.max(...buckets.map((b) => b.doc_count));
  return buckets.map((b) => ({ ...b, height: b.doc_count / maxCount }));
}

function RangeFacet({ field }: { field: string }) {
  const { aggregations } = useSearch();
  const {
    ranges: {
      [field]: { min, max, values },
    },
    filterRange,
  } = useSearchStore();
  const theme = useTheme();

  const debouncedCallback = useDebouncedCallback((value: number | number[]) => {
    if (!Array.isArray(value)) {
      return;
    }
    filterRange({ field, min: value[0], max: value[1] });
  }, 400);

  const aggBuckets = aggregations?.[field]?.buckets;

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
          value={[values.min, values.max]}
          min={min}
          max={max}
          valueLabelDisplay="auto"
          onChange={(_, value) => {
            debouncedCallback(value);
          }}
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

export default RangeFacet;
