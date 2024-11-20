import React, { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { trackEvent } from 'js/helpers/trackers';
import { useSearch } from '../Search';
import { RangeConfig, RangeValues, isRangeFacet, isRangeFilter, useSearchStore } from '../store';
import FacetAccordion from './FacetAccordion';
import { useGetFieldLabel } from '../fieldConfigurations';

interface HistogramBucket {
  doc_count: number;
  key: string;
}

function buildBins({ buckets }: { buckets: HistogramBucket[] }) {
  const maxCount = Math.max(...buckets.map((b) => b.doc_count));
  return buckets.map((b) => ({ ...b, height: b.doc_count / maxCount }));
}

function isSelectedBin({ key, min, max }: { key: number; min?: number; max?: number }) {
  if (min === undefined || max === undefined) {
    return true;
  }

  return key >= min && key <= max;
}

function RangeFacet({ filter, field, facet }: { filter: RangeValues; field: string; facet: RangeConfig }) {
  const aggs = useSearch()?.aggregations?.[field]?.[field];
  const filterRange = useSearchStore((state) => state.filterRange);
  const analyticsCategory = useSearchStore((state) => state.analyticsCategory);

  const theme = useTheme();
  const getFieldLabel = useGetFieldLabel();
  const { values } = filter;
  const { min, max } = facet;

  const [selectedValues, setSelectedValues] = useState<(number | undefined)[]>([min, max]);

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

      trackEvent({
        category: analyticsCategory,
        action: 'Set Range Facet',
        label: field,
      });

      filterRange({ field, min: value[0], max: value[1] });
    },
    [filterRange, field, analyticsCategory],
  );

  if (!(aggs && 'buckets' in aggs)) {
    return null;
  }

  const aggBuckets = aggs.buckets;

  if (!aggBuckets || !Array.isArray(aggBuckets)) {
    return null;
  }

  const bins = buildBins({ buckets: aggBuckets });

  const actualMin = 0 ?? min;
  const actualMax = Math.max(...bins.map((b) => parseInt(b.key, 10))) ?? max;

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
                  backgroundColor: isSelectedBin({ min: values.min, max: values.max, key })
                    ? theme.palette.success.light
                    : theme.palette.secondary.main,
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
          value={[selectedValues[0] ?? actualMin, selectedValues[1] ?? actualMax]}
          min={actualMin}
          max={actualMax}
          valueLabelDisplay="auto"
          onChange={handleChange}
          onChangeCommitted={handleCommittedChange}
          marks={[
            { value: actualMin, label: actualMin },
            { value: actualMax, label: actualMax },
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
  const filter = useSearchStore((state) => state.filters[field]);
  const facet = useSearchStore((state) => state.facets[field]);

  if (!isRangeFilter(filter) || !isRangeFacet(facet)) {
    return null;
  }

  return <RangeFacet field={field} facet={facet} filter={filter} />;
}

export default FacetGuard;
